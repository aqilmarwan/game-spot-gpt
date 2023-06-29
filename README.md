## The Game Spot GPT
AI-powered search and chat for Game Spot."

The Game Spot GPT

Dataset
The dataset is a CSV file containing all text & embeddings used.

Download it here.

I recommend getting familiar with fetching, cleaning, and storing data as outlined in the scraping and embedding scripts below, but feel free to skip those steps and just use the dataset.

How It Works
The Game Spot GPT provides 2 things:

A search interface.
A chat interface.
Search
Search was created with OpenAI Embeddings (text-embedding-ada-002).

First, we loop over the essays and generate embeddings for each chunk of text.

Then in the app we take the user's search query, generate an embedding, and use the result to find the most similar passages from the book.

The comparison is done using cosine similarity across our database of vectors.

Our database is a Postgres database with the pgvector extension hosted on Supabase.

Results are ranked by similarity score and returned to the user.

Chat
Chat builds on top of search. It uses search results to create a prompt that is fed into GPT-3.5-turbo.

This allows for a chat-like experience where the user can ask questions about the book and get answers.

Running Locally
Here's a quick overview of how to run it locally.

Requirements
Set up OpenAI
You'll need an OpenAI API key to generate embeddings.

Set up Supabase and create a database
Note: You don't have to use Supabase. Use whatever method you prefer to store your data. But I like Supabase and think it's easy to use.

There is a schema.sql file in the root of the repo that you can use to set up the database.

Run that in the SQL editor in Supabase as directed.

I recommend turning on Row Level Security and setting up a service role to use with the app.

Repo Setup
Clone repo
git clone https://github.com/aqilmarwan/gamespot-gpt.git
Install dependencies
npm i
Set up environment variables
Create a .env.local file in the root of the repo with the following variables:

OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
Dataset
Run scraping script
npm run scrape
This scrapes all of the posts from the Game Spot website and saves them to a json file.

Run embedding script
npm run embed
This reads the json file, generates embeddings for each chunk of text, and saves the results to your database.

There is a 100ms delay between each request to avoid rate limiting.

This process will take 20-30 minutes.

App
Run app
npm run dev
Credits

Notes
I sacrificed composability for simplicity in the app.

Yes, you can make things more modular and reusable.

But I kept pretty much everything in the homepage component for the sake of simplicity.