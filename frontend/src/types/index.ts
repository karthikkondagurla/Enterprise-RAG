// Types for the RAG system

export interface Citation {
    source: string;
    content: string;
    score: number;
    lastUpdated?: string;
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    citations?: Citation[];
    confidence?: number;
    isStreaming?: boolean;
    isCached?: boolean;
    timestamp: Date;
}

export interface QueryResponse {
    query: string;
    answer: string;
    context: Citation[];
    confidence?: number;
    cached?: boolean;
}

export interface FeedbackData {
    messageId: string;
    type: "positive" | "negative";
    reason?: string;
}

export interface Ticket {
    id: string;
    customer: string;
    subject: string;
    content: string;
    status: "open" | "pending" | "resolved";
    createdAt: Date;
}

export interface MetricData {
    label: string;
    value: number | string;
    change?: number;
    trend?: "up" | "down" | "neutral";
}
