import os
import requests
import json
from typing import List, Dict, Any

class Generator:
    def __init__(self):
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = "llama3.2:3b"

    def generate_answer(self, query: str, context: List[Dict[str, Any]]) -> str:
        """
        Generate answer using Ollama.
        """
        # 1. Construct Prompt
        context_text = "\n\n".join(
            [f"Source: {c['source']}\nContent: {c['content']}" for c in context]
        )
        
        system_prompt = (
            "You are an enterprise-grade AI assistant deployed in a production Customer Support and Help Desk system.\n\n"
            "You must provide accurate, explainable, and trustworthy answers.\n"
            "You are evaluated on correctness, grounding, and refusal quality.\n\n"
            "========================\n"
            "DECISION POLICY (MANDATORY)\n"
            "========================\n\n"
            "For every user question, follow this decision flow:\n\n"
            "STEP 1 — Context Relevance Check\n"
            "- Examine the Retrieved Context.\n"
            "- Decide whether it is RELEVANT, PARTIALLY RELEVANT, or NOT RELEVANT to the question.\n\n"
            "STEP 2 — Knowledge Source Selection\n"
            "- If context is RELEVANT or PARTIALLY RELEVANT:\n"
            "  - Answer using ONLY the retrieved context.\n"
            "  - Do NOT add external or assumed knowledge.\n"
            "- If context is NOT RELEVANT or EMPTY:\n"
            "  - You MAY answer using general world knowledge.\n"
            "  - You MUST clearly label the answer as general knowledge.\n\n"
            "STEP 3 — Confidence Check\n"
            "- If you cannot answer confidently based on allowed sources:\n"
            "  - Refuse safely.\n"
            "  - Do NOT guess.\n\n"
            "========================\n"
            "GROUNDING RULES (STRICT)\n"
            "========================\n\n"
            "- Retrieved documents override all other knowledge.\n"
            "- Never blend document knowledge with general knowledge silently.\n"
            "- Never invent facts, procedures, policies, limits, prices, or dates.\n"
            "- Never “fill in gaps” when context exists but is incomplete.\n\n"
            "========================\n"
            "ANSWER STRUCTURE (MANDATORY)\n"
            "========================\n\n"
            "Always structure your response as follows:\n\n"
            "1. Short Direct Answer\n"
            "2. Explanation (concise, factual)\n"
            "3. Source Attribution (ONLY if documents were used)\n\n"
            "If answering from general knowledge, explicitly state:\n"
            "“This answer is based on general knowledge and not on internal documents.”\n"
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
