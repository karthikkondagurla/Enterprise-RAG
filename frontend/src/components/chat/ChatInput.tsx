"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
    onSubmit: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSubmit,
    isLoading = false,
    placeholder = "Type your question...",
}: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSubmit(input.trim());
            setInput("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                className="min-h-[48px] max-h-[120px] resize-none bg-white"
                rows={1}
                aria-label="Message input"
            />
            <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 h-12 w-12 p-0"
                aria-label="Send message"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
            </Button>
        </form>
    );
}
