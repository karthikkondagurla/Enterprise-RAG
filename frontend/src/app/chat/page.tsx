"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, HelpCircle } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Message, Citation } from "@/types";
import { queryRAG } from "@/lib/api";

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI support assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call RAG API
            const response = await queryRAG(content);

            // Transform context to citations
            const citations: Citation[] = response.context.map((ctx) => ({
                source: ctx.source,
                content: ctx.content,
                score: ctx.score,
            }));

            // Calculate average confidence from scores
            const avgConfidence =
                citations.length > 0
                    ? citations.reduce((sum, c) => sum + c.score, 0) / citations.length
                    : 0.5;

            // Add assistant message
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: response.answer,
                citations,
                confidence: avgConfidence,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            // Error state
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content:
                    "I apologize, but I encountered an issue processing your request. Please try again or contact support.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = (messageId: string, type: "positive" | "negative") => {
        // TODO: Send feedback to backend
        console.log("Feedback:", { messageId, type });
    };

    const handleEscalate = () => {
        // TODO: Implement escalation flow
        alert("Connecting you to a human agent...");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900">
                                Enterprise Support
                            </h1>
                            <p className="text-xs text-slate-500">AI-powered assistance</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-500">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Help
                    </Button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-hidden">
                <div className="max-w-3xl mx-auto h-full flex flex-col p-4">
                    <Card className="flex-1 flex flex-col overflow-hidden bg-white">
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        onFeedback={(type) => handleFeedback(message.id, type)}
                                        onEscalate={handleEscalate}
                                    />
                                ))}
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500 p-4">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        </div>
                                        AI is thinking...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="border-t border-slate-200 p-4 bg-slate-50">
                            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
                            <p className="text-xs text-slate-400 mt-2 text-center">
                                AI responses are generated from your knowledge base. Always verify critical
                                information.
                            </p>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
