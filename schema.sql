--  RUN 1st
create extension vector;

-- RUN 2nd
create table gs (
  id bigserial primary key,
  post_title text,
  post_url text,
  post_date text,
  post_type text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scraping and embedding scripts
create or replace function gs_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  post_title text,
  post_url text,
  post_date text,
  post_type text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    gs.id,
    gs.post_title,
    gs.post_url,
    gs.post_date,
    gs.post_type,
    gs.content,
    gs.content_length,
    gs.content_tokens,
    1 - (gs.embedding <=> query_embedding) as similarity
  from gs
  where 1 - (gs.embedding <=> query_embedding) > similarity_threshold
  order by gs.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on gs
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);