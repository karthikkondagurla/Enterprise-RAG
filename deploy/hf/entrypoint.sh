#!/bin/bash

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 1
done

# Pull the model if it doesn't exist (assuming /root/.ollama is persistent if mounted)
echo "Checking for model llama3.2:3b..."
if ! ollama list | grep -q "llama3.2:3b"; then
    echo "Model not found. Pulling llama3.2:3b..."
    ollama pull llama3.2:3b
else
    echo "Model llama3.2:3b found."
fi

# Start FastAPI
echo "Starting FastAPI on port 7860..."
uvicorn src.main:app --host 0.0.0.0 --port 7860
