from qdrant_client import QdrantClient
print(dir(QdrantClient))
client = QdrantClient(url="http://localhost:6333")
print("Has search?", hasattr(client, "search"))
print("Has query?", hasattr(client, "query"))
print("Has query_points?", hasattr(client, "query_points"))
