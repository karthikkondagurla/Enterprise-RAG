from typing import List, Dict, Any
from src.ingestion.vector_store import VectorStore
from src.ingestion.embedder import Embedder

class Retriever:
    def __init__(self):
        self.vector_store = VectorStore()
        self.embedder = Embedder()

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents for a query.
        Currently implements semantic search.
        Future: Add keyword search (BM25) and RRF fusion.
        """
        # 1. Generate query embedding
        query_vector = self.embedder.embed_query(query)

        # 2. Search in Vector Store
        results = self.vector_store.search(query_vector, limit=top_k)

        # 3. Format results
        formatted_results = []
        for res in results:
            formatted_results.append({
                "content": res["payload"].get("page_content", ""),
                "source": res["payload"].get("source", "Unknown"),
                "score": res["score"]
            })
        
        return formatted_results
