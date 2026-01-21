import os
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from src.ingestion.loader import DocumentLoader
from src.ingestion.chunker import DocumentChunker
from src.ingestion.embedder import Embedder
from src.ingestion.vector_store import VectorStore
from src.rag.pipeline import RAGPipeline

# Load env vars
load_dotenv()

app = FastAPI(title="Enterprise RAG System API")

# CORS - Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
loader = DocumentLoader()
chunker = DocumentChunker()
embedder = Embedder()
vector_store = VectorStore()
rag_pipeline = RAGPipeline()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    query: str
    answer: str
    context: List[dict]

@app.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """
    Upload and ingest a document (PDF/TXT/MD).
    """
    temp_file_path = f"temp_{file.filename}"
    
    try:
        # Save uploaded file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 1. Load
        raw_docs = loader.load_file(temp_file_path)
        if not raw_docs:
            raise HTTPException(status_code=400, detail="Could not load document content")

        # 2. Chunk
        chunks = chunker.chunk_documents(raw_docs)
        
        # 3. Embed
        texts = [doc.page_content for doc in chunks]
        embeddings = embedder.embed_documents(texts)
        
        # 4. Store
        vector_store.add_documents(chunks, embeddings)
        
        return {
            "message": f"Successfully ingested {file.filename}",
            "chunks_count": len(chunks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.post("/query", response_model=QueryResponse)
async def query_knowledge_base(request: QueryRequest):
    """
    Ask a question to the RAG system.
    """
    try:
        result = rag_pipeline.run(request.query)
        return QueryResponse(
            query=result["query"],
            answer=result["answer"],
            context=result["retrieved_context"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
