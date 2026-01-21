# Deploying to Hugging Face Spaces

This guide explains how to deploy the Enterprise RAG Backend to Hugging Face Spaces using the `deploy/hf/Dockerfile`.

## Prerequisites
1.  **Hugging Face Account**: [Sign up here](https://huggingface.co/join).
2.  **Qdrant Cloud Account** (Free Tier): [Sign up here](https://cloud.qdrant.io/).
    -   Create a cluster and get the `URL` and `API KEY`.
3.  **Neon Postgres** (Optional, if using metadata): [Sign up here](https://neon.tech/).

## Deployment Steps

1.  **Create a New Space**
    -   Go to [Hugging Face Spaces](https://huggingface.co/spaces).
    -   Click **"Create new Space"**.
    -   Name: `enterprise-rag-backend` (or similar).
    -   SDK: **Docker**.
    -   Template: **Blank**.

2.  **Upload Code**
    -   Use `git` to push your code to the Space's repository.
    -   **Important**: You must place the content of `deploy/hf/Dockerfile` into the *root* `Dockerfile` of the Space, or configure the Space to use the specific path (HF Spaces usually expects `Dockerfile` in root).
    -   *Simpler Method*: Copy `deploy/hf/Dockerfile` to the root of your repo when pushing to HF.

3.  **Configure Environment Variables**
    In your Space's **Settings** tab, add the following variables:
    -   `QDRANT_URL`: Your Qdrant Cloud URL (e.g., `https://xyz...qdrant.tech`).
    -   `QDRANT_API_KEY`: Your Qdrant Cloud API Key.
    -   `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`: Connection details for your Neon DB.

4.  **Persistent Storage (Optional but Recommended)**
    -   To avoid downloading the LLM (`llama3.2:3b`) on every restart, go to **Settings** -> **Persistent Storage** and enable it (Minimum tier).
    -   The `Dockerfile` is set up to store ollama models in `/root/.ollama`, which you can map to persistent storage.

## Accessing the API
Once built, your API will be available at:
`https://huggingface.co/spaces/<your-username>/enterprise-rag-backend/api` (direct URL provided by HF).

You can then update your **Next.js Frontend** (on Vercel) to point to this URL (`NEXT_PUBLIC_API_URL`).
