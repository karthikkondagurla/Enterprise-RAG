import os
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models as rest
from langchain_core.documents import Document

class VectorStore:
    def __init__(self, collection_name: str = "enterprise_rag"):
        self.collection_name = collection_name
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self.client = QdrantClient(url=qdrant_url)
        self.vector_size = 384  # Default for BGE-small-en-v1.5

    def ensure_collection_exists(self):
        """
        Check if collection exists, if not create it.
        """
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        
        if not exists:
            print(f"Creating collection {self.collection_name}...")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=rest.VectorParams(
                    size=self.vector_size,
                    distance=rest.Distance.COSINE
                )
            )

    def add_documents(self, documents: List[Document], embeddings: List[List[float]]):
        """
        Upsert documents into Qdrant.
        """
        self.ensure_collection_exists()
        
        points = []
        for idx, (doc, emb) in enumerate(zip(documents, embeddings)):
            # Generate a consistent ID or use UUID
            # For simplicity using hash of content or random text
            # In prod, meaningful IDs are better
            import uuid
            point_id = str(uuid.uuid4())
            
            payload = doc.metadata.copy()
            payload["page_content"] = doc.page_content
            
            points.append(rest.PointStruct(
                id=point_id,
                vector=emb,
                payload=payload
            ))
            
        # Batch upsert
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        print(f"Upserted {len(points)} points into {self.collection_name}")

    def search(self, query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Semantic search using vector.
        """
        hits = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        ).points
        
        results = []
        for hit in hits:
            results.append({
                "score": hit.score,
                "payload": hit.payload
            })
        return results
