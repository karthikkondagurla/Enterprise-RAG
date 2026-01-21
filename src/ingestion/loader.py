import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredMarkdownLoader
from langchain_core.documents import Document

class DocumentLoader:
    def __init__(self):
        pass

    def load_file(self, file_path: str) -> List[Document]:
        """
        Load a file based on its extension.
        Supported: .pdf, .txt, .md
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()

        try:
            if ext == '.pdf':
                loader = PyPDFLoader(file_path)
            elif ext == '.txt':
                loader = TextLoader(file_path, encoding='utf-8')
            elif ext == '.md':
                # Setup unstructured loader or simple text loader for markdown if unstructured is too heavy
                # For MVP, treating MD as text is often safer/faster unless structured parsing is needed
                loader = TextLoader(file_path, encoding='utf-8') 
            else:
                raise ValueError(f"Unsupported file type: {ext}")
            
            return loader.load()
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            return []

    def load_directory(self, directory_path: str) -> List[Document]:
        """
        Load all supported files from a directory.
        """
        docs = []
        for root, _, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                if file_path.endswith(('.pdf', '.txt', '.md')):
                    docs.extend(self.load_file(file_path))
        return docs
