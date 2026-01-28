# Enterprise RAG System

An enterprise-grade Retrieval-Augmented Generation (RAG) system built with modern AI technologies for intelligent document querying and knowledge retrieval.

## Overview

This project implements a full-stack RAG system that enables semantic search and context-aware question answering over your documents. It combines the power of large language models with vector databases to provide accurate, contextual responses.

## Features

- **Advanced LLM Integration**: Powered by Llama 3.2 for high-quality text generation
- **Vector Database**: Uses Qdrant for efficient semantic search and retrieval
- **Full-Stack Application**: 
  - React-based frontend for intuitive user interaction
  - FastAPI backend for high-performance API endpoints
- **Document Processing**: Ingests and processes various document formats
- **Semantic Search**: Advanced embedding-based document retrieval
- **Context-Aware Responses**: Generates answers grounded in your document corpus
- **Docker Support**: Easy deployment with docker-compose
- **Hugging Face Ready**: Prepared for deployment on Hugging Face Spaces

## Tech Stack

### Backend
- **Python** - Core programming language
- **FastAPI** - High-performance web framework
- **Qdrant** - Vector database for embeddings
- **Llama 3.2** - Large language model
- **LangChain** - LLM application framework

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **CSS** - Styling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose (optional)
- Qdrant instance (local or cloud)

## Installation

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/karthikkondagurla/Enterprise-RAG.git
cd Enterprise-RAG
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Docker Setup

```bash
docker-compose up -d
```

## Usage

### Running the Backend

```bash
python -m src.main
```

### Running the Frontend

```bash
cd frontend
npm start
```

### Testing RAG Functionality

```bash
python verify_rag.py
```

## Project Structure

```
Enterprise-RAG/
├── src/                    # Backend source code
├── frontend/               # React frontend application
├── deploy/hf/             # Hugging Face deployment configs
├── requirements.txt       # Python dependencies
├── docker-compose.yml     # Docker orchestration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Configuration

Key configuration options in `.env`:

- `QDRANT_URL` - Qdrant database endpoint
- `QDRANT_API_KEY` - Authentication key for Qdrant
- `MODEL_NAME` - LLM model identifier
- Additional model and API configurations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Acknowledgments

- Built with Llama 3.2 by Meta
- Vector search powered by Qdrant
- Frontend framework by React team
