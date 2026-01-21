import os
import requests
import json
from typing import List, Dict

class Generator:
    def __init__(self):
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = "qwen2.5:7b-instruct-q4_k_m" # Default, can be overridden

    def generate_answer(self, query: str, context: List[Dict[str, Any]]) -> str:
        """
        Generate answer using Ollama (Qwen 3).
        """
        # 1. Construct Prompt
        context_text = "\n\n".join(
            [f"Source: {c['source']}\nContent: {c['content']}" for c in context]
        )
        
        system_prompt = (
            "You are an expert Enterprise Support Assistant. "
            "Answer the user's question based ONLY on the provided context. "
            "If the answer is not in the context, say 'I don't know'. "
            "ALWAYS cite your sources using the format [Source: filename]."
        )
        
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {query}"

        payload = {
            "model": self.model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "options": {
                "temperature": 0.1 # Low temperature for factual accuracy
            }
        }

        try:
            response = requests.post(f"{self.ollama_base_url}/api/chat", json=payload)
            response.raise_for_status()
            return response.json()["message"]["content"]
        except Exception as e:
            return f"Error generating answer: {str(e)}"
