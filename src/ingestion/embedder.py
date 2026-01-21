from typing import List
from fastembed import TextEmbedding

class Embedder:
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        """
        Initialize FastEmbed model.
        FastEmbed is lightweight and faster than full transformers.
        """
        # caching is handled by fastembed automatically
        self.model = TextEmbedding(model_name=model_name)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts.
        Returns a list of vectors (list of floats).
        """
        # FastEmbed returns a generator, convert to list
        embeddings_generator = self.model.embed(texts)
        return [list(emb) for emb in embeddings_generator]

    def embed_query(self, text: str) -> List[float]:
        """
        Generate embedding for a single query.
        """
        # embed returns generator, get first item
        embeddings_generator = self.model.embed([text])
        return list(next(embeddings_generator))
