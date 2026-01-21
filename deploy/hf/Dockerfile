FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src ./src
COPY deploy/hf/entrypoint.sh ./entrypoint.sh

# Make entrypoint executable and fix line endings (CRLF -> LF)
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Create directory for Ollama models (useful for persistent storage mounting)
RUN mkdir -p /root/.ollama

# Expose the standard HF Spaces port
EXPOSE 7860

# Set environment variables
ENV OLLAMA_BASE_URL=http://localhost:11434
ENV HOST=0.0.0.0
ENV PORT=7860

# Run the entrypoint script
CMD ["./entrypoint.sh"]
