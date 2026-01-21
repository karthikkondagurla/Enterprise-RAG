"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Message } from "@/types";
import { CitationCard } from "@/components/citations/CitationCard";
import { ConfidenceBadge } from "@/components/feedback/ConfidenceBadge";
import { FeedbackControls } from "@/components/feedback/FeedbackControls";

interface ChatMessageProps {
    message: Message;
    onFeedback?: (type: "positive" | "negative") => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex gap-3 p-4 rounded-2xl",
                isUser ? "bg-slate-50" : "bg-white border border-slate-200"
            )}
        >
            {/* Avatar */}
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                    className={cn(
                        isUser ? "bg-slate-200 text-slate-600" : "bg-blue-100 text-blue-600"
                    )}
                >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 space-y-3 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                        {isUser ? "You" : "AI Assistant"}
                    </span>
                </div>

                {/* Message Text */}
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                    )}
                </p>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Sources ({message.citations.length})
                        </p>
                        <div className="space-y-2">
                            {message.citations.map((citation, index) => (
                                <CitationCard key={index} citation={citation} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Confidence + Feedback (for assistant messages only) */}
                {!isUser && !message.isStreaming && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {message.confidence !== undefined && (
                            <ConfidenceBadge confidence={message.confidence} />
                        )}
                        <FeedbackControls onFeedback={onFeedback} />
                    </div>
                )}
            </div>
        </div>
    );
}
