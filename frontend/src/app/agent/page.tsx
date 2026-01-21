"use client";

import { useState } from "react";
import {
    Bot,
    User,
    Copy,
    Check,
    ChevronDown,
    RefreshCw,
    FileText,
    Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfidenceBadge } from "@/components/feedback/ConfidenceBadge";
import { CitationCard } from "@/components/citations/CitationCard";
import { queryRAG } from "@/lib/api";
import { Citation } from "@/types";

// Mock ticket data
const mockTicket = {
    id: "12345",
    customer: "Jane Doe",
    email: "jane.doe@example.com",
    subject: "Payment Gateway Timeout Error",
    content: `Hi,

I've been trying to complete a payment for the past hour but keep getting a "504 Gateway Timeout" error. I've tried multiple times with different cards but the issue persists.

This is urgent as I need to complete this purchase today.

Thanks,
Jane`,
    priority: "high" as const,
    createdAt: new Date("2024-01-22T10:30:00"),
};

export default function AgentDashboard() {
    const [aiResponse, setAiResponse] = useState<string>("");
    const [citations, setCitations] = useState<Citation[]>([]);
    const [confidence, setConfidence] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [replyDraft, setReplyDraft] = useState("");

    const handleGenerateSuggestion = async () => {
        setIsLoading(true);
        try {
            const response = await queryRAG(
                `Customer issue: ${mockTicket.subject}. Details: ${mockTicket.content}`
            );
            setAiResponse(response.answer);
            setCitations(
                response.context.map((ctx) => ({
                    source: ctx.source,
                    content: ctx.content,
                    score: ctx.score,
                }))
            );
            setConfidence(
                response.context.reduce((sum, c) => sum + c.score, 0) /
                response.context.length
            );
        } catch (error) {
            setAiResponse("Failed to generate suggestion. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToReply = () => {
        setReplyDraft(aiResponse);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-amber-100 text-amber-700",
        low: "bg-green-100 text-green-700",
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900">
                                Agent Assist
                            </h1>
                            <p className="text-xs text-slate-500">AI-powered suggestions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                                JD
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-700">John Doe</span>
                        <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex h-[calc(100vh-64px)]">
                {/* Left Panel - Ticket Context */}
                <div className="w-1/2 border-r border-slate-200 bg-white overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Ticket #{mockTicket.id}
                            </h2>
                            <Badge className={priorityColors[mockTicket.priority]}>
                                {mockTicket.priority.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-base font-medium text-slate-800">
                            {mockTicket.subject}
                        </p>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            {/* Customer Info */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-slate-100 text-slate-600">
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {mockTicket.customer}
                                    </p>
                                    <p className="text-xs text-slate-500">{mockTicket.email}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Ticket Content */}
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {mockTicket.content}
                                </p>
                            </div>

                            <p className="text-xs text-slate-400">
                                Received: {mockTicket.createdAt.toLocaleString()}
                            </p>
                        </div>
                    </ScrollArea>

                    {/* Reply Composer */}
                    <div className="border-t border-slate-200 p-4">
                        <Textarea
                            value={replyDraft}
                            onChange={(e) => setReplyDraft(e.target.value)}
                            placeholder="Compose your reply..."
                            className="min-h-[100px] mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                                Save Draft
                            </Button>
                            <Button size="sm">Send Reply</Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - AI Suggestions */}
                <div className="w-1/2 overflow-hidden flex flex-col">
                    <div className="p-4 bg-white border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-900">
                                AI Suggestions
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateSuggestion}
                                disabled={isLoading}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                                />
                                Generate
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {aiResponse ? (
                            <div className="space-y-4">
                                {/* AI Response Card */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm">
                                                Suggested Response
                                            </CardTitle>
                                            <ConfidenceBadge confidence={confidence} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {aiResponse}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopyToReply}
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-1" />
                                                        Insert into Reply
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Sources */}
                                {citations.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Sources ({citations.length})
                                        </p>
                                        {citations.map((citation, index) => (
                                            <CitationCard key={index} citation={citation} />
                                        ))}
                                    </div>
                                )}

                                {/* Debug Panel */}
                                <Collapsible open={showDebug} onOpenChange={setShowDebug}>
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-between text-slate-500"
                                        >
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-4 w-4" />
                                                Retrieval Debug
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${showDebug ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <Card className="mt-2 bg-slate-50">
                                            <CardContent className="p-3">
                                                <pre className="text-xs text-slate-600 overflow-x-auto">
                                                    {JSON.stringify(
                                                        { query: mockTicket.subject, citations },
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <Bot className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">
                                        Click &quot;Generate&quot; to get AI suggestions
                                    </p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </main>
        </div>
    );
}
