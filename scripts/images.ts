import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const BASE_URL = "https://www.gamespot.com";

const NEWS_PAGE_1 = "/news/";
const NEWS_PAGE_2 = "/news/?page=2";

const GAMES_REVIEWS_PAGE_1 = "/games/reviews/";
const GAMES_REVIEWS_PAGE_2 = "/games/reviews/?page=2";

const getNewsImages = async (page: string) => {
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const li = $("div.card-item");

  let images: { title: string; src: string }[] = [];

  li.each((i, li) => {
    const title = $(li).find("h4.card-item__title").text().trim();
    const src = $(li).find("img").attr("src");

    if (title && src) {
      images.push({ title, src });
    }
  });

  console.log("GameSpot News Images" + images);
  return images;
};

const getGamesReviewsImages = async (page: string) => {
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const oneHalf = $("div.card-item");

  let images: { title: string; src: string }[] = [];

  oneHalf.each((i, el) => {
    const title = $(el).find("h4.card-item__title").text().trim();
    const src = $(el).find("img").attr("src");

    if (title && src) {
      images.push({ title, src });
    }
  });
  console.log("GameSpot Reviews Images" + images);
  return images;
};

(async () => {
  let images: { title: string; src: string }[] = [];

  const newsPage1Images = await getNewsImages(NEWS_PAGE_1);
  const newsPage2Images = await getNewsImages(NEWS_PAGE_2);

  const gamesreviewsPage1Images = await getGamesReviewsImages(GAMES_REVIEWS_PAGE_1);
  const gamesreviewsPage2Images = await getGamesReviewsImages(GAMES_REVIEWS_PAGE_2);

  images = [...newsPage1Images, ...newsPage2Images, ...gamesreviewsPage1Images, ...gamesreviewsPage2Images];

  console.log(images);
  console.log(images.length);

  fs.writeFileSync("scripts/images.json", JSON.stringify(images));
})();
