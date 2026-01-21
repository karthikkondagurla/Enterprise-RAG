from typing import Dict, Any
from src.rag.retriever import Retriever
from src.rag.generator import Generator

class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever()
        self.generator = Generator()

    def run(self, query: str) -> Dict[str, Any]:
        """
        End-to-end RAG flow.
        """
        # 1. Retrieve
        retrieved_docs = self.retriever.retrieve(query)

        # 2. Generate
        answer = self.generator.generate_answer(query, retrieved_docs)

        return {
            "query": query,
            "answer": answer,
            "retrieved_context": retrieved_docs
        }
