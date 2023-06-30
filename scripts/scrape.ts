import { GSChunk, GSJSON, GSPost } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { encode } from "gpt-3-encoder";

const BASE_URL = "https://www.gamespot.com";

const NEWS_PAGE_1 = "/news/";
const NEWS_PAGE_2 = "/news/?page=2";

const REVIEWS_PAGE_1 = "/games/reviews/";
const REVIEWS_PAGE_2 = "/games/reviews/?page=2";

const CHUNK_SIZE = 200;

const getLinks = async (page: string) => {
  console.log("Scraping GameSpot...");
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const list = $("div.card-item__content");

  const links: string[] = [];

  list.each((i, link) => {
    const href = $(link).find("a.card-item__link").attr("href");
  
    if (href) {
      links.push(BASE_URL + href);
    }
  });

  return links;
};

const getPost = async (url: string) => {
  let post: GSPost = {
    title: "",
    url: "",
    date: "",
    content: "",
    length: 0,
    tokens: 0,
    chunks: []
  };

  const html = await axios.get(url);
  const $ = cheerio.load(html.data);

  const title = $("article h1").text().trim() || $("div .kubrick-info__title").text().trim();
  const date = $("article time").text().trim();
  const text = $("div .js-content-entity-body").text().trim();

  let cleanedText = text.replace(/\s+/g, " ");
  cleanedText = cleanedText.replace(/\.([a-zA-Z])/g, ". $1");

  const trimmedContent = cleanedText.trim();

  post = {
    title,
    url,
    date,
    content: trimmedContent,
    length: trimmedContent.length,
    tokens: encode(trimmedContent).length,
    chunks: []
  };

  return post;
};

const chunkPost = async (post: GSPost) => {
  const { title, url, date, content } = post;

  let postTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        postTextChunks.push(chunkText);
        chunkText = "";
      }

      if (sentence[sentence.length - 1] && sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }

    postTextChunks.push(chunkText.trim());
  } else {
    postTextChunks.push(content.trim());
  }

  const postChunks = postTextChunks.map((text) => {
    const trimmedText = text.trim();

    const chunk: GSChunk = {
      post_title: title,
      post_url: url,
      post_date: date,
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: []
    };

    return chunk;
  });

  if (postChunks.length > 1) {
    for (let i = 0; i < postChunks.length; i++) {
      const chunk = postChunks[i];
      const prevChunk = postChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        postChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: GSPost = {
    ...post,
    chunks: postChunks
  };

  return chunkedSection;
};

(async () => {
  const newspage1Links = await getLinks(NEWS_PAGE_1);
  const newspage2Links = await getLinks(NEWS_PAGE_2);
  const newsLinks = [...newspage1Links, ...newspage2Links];

  let posts = [];

  for (let i = 0; i < newsLinks.length; i++) {
    const link = newsLinks[i];
    const post = await getPost(link);
    const chunkedPost = await chunkPost(post);

    posts.push(chunkedPost);
  }

  const reviewsPage1Links = await getLinks(REVIEWS_PAGE_1);
  const reviewsPage2Links = await getLinks(REVIEWS_PAGE_2);
  const reviewsLinks = [...reviewsPage1Links, ...reviewsPage2Links];

  for (let i = 0; i < reviewsLinks.length; i++) {
    const link = reviewsLinks[i];
    const post = await getPost(link);
    const chunkedPost = await chunkPost(post);

    posts.push(chunkedPost);
  }

  const todayDate = new Date().toISOString().split("T")[0];

  const json: GSJSON = {
    current_date: todayDate,
    url: BASE_URL,
    length: posts.reduce((acc, essay) => acc + essay.length, 0),
    tokens: posts.reduce((acc, essay) => acc + essay.tokens, 0),
    posts
  };

  console.log("Writing to gs.json...");
  fs.writeFileSync("scripts/gs.json", JSON.stringify(json));
  console.log("Done!");
})();