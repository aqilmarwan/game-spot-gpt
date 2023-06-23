export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export type GSPost = {
  title: string;
  url: string;
  date: string;
  type: "post" | "mini";
  content: string;
  length: number;
  tokens: number;
  chunks: GSChunk[];
};

export type GSChunk = {
  post_title: string;
  post_url: string;
  post_date: string | undefined;
  post_type: "post" | "mini";
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type GSJSON = {
  current_date: string;
  author: string;
  url: string;
  length: number;
  tokens: number;
  posts: GSPost[];
};
