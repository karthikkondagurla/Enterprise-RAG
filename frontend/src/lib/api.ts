const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function queryRAG(query: string): Promise<{
    answer: string;
    context: Array<{ source: string; content: string; score: number }>;
}> {
    const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

export async function ingestDocument(file: File): Promise<{
    message: string;
    chunks_count: number;
}> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/ingest`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

export async function sendFeedback(
    messageId: string,
    type: "positive" | "negative",
    reason?: string
): Promise<void> {
    // Placeholder - implement when backend supports feedback
    console.log("Feedback:", { messageId, type, reason });
}

export async function healthCheck(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
