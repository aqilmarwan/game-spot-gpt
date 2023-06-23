--  RUN 1st
create extension vector;

-- RUN 2nd
create table tem (
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
create or replace function tem_search (
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
    tem.id,
    tem.post_title,
    tem.post_url,
    tem.post_date,
    tem.post_type,
    tem.content,
    tem.content_length,
    tem.content_tokens,
    1 - (tem.embedding <=> query_embedding) as similarity
  from tem
  where 1 - (tem.embedding <=> query_embedding) > similarity_threshold
  order by tem.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on tem
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);