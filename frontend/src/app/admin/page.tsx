"use client";

import { useState } from "react";
import {
    Bot,
    MessageSquare,
    AlertTriangle,
    DollarSign,
    TrendingUp,
    TrendingDown,
    ThumbsDown,
    HelpCircle,
    LogOut,
    BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Mock data
const metrics = [
    {
        label: "Total Queries",
        value: "1,234",
        change: 12,
        trend: "up" as const,
        icon: MessageSquare,
    },
    {
        label: "Success Rate",
        value: "92%",
        change: 3,
        trend: "up" as const,
        icon: TrendingUp,
    },
    {
        label: "Escalation Rate",
        value: "8%",
        change: -2,
        trend: "down" as const,
        icon: AlertTriangle,
    },
    {
        label: "Est. Cost Saved",
        value: "$2,450",
        change: 18,
        trend: "up" as const,
        icon: DollarSign,
    },
];

const topUnanswered = [
    { question: "How do I reset my 2FA?", count: 45 },
    { question: "What is the refund policy for enterprise plans?", count: 32 },
    { question: "How to integrate with Slack?", count: 28 },
    { question: "Can I export my data in CSV format?", count: 21 },
    { question: "What happens when my trial ends?", count: 19 },
];

const recentFeedback = [
    {
        id: "1",
        type: "negative" as const,
        query: "How to cancel subscription?",
        reason: "Answer was outdated",
        timestamp: "2 hours ago",
    },
    {
        id: "2",
        type: "negative" as const,
        query: "API rate limits",
        reason: "Incomplete information",
        timestamp: "3 hours ago",
    },
    {
        id: "3",
        type: "negative" as const,
        query: "Password requirements",
        reason: "Incorrect answer",
        timestamp: "5 hours ago",
    },
];

const usageData = [
    { day: "Mon", queries: 180 },
    { day: "Tue", queries: 220 },
    { day: "Wed", queries: 195 },
    { day: "Thu", queries: 240 },
    { day: "Fri", queries: 210 },
    { day: "Sat", queries: 95 },
    { day: "Sun", queries: 85 },
];

// Simple bar chart component
function SimpleBarChart({
    data,
}: {
    data: Array<{ day: string; queries: number }>;
}) {
    const maxValue = Math.max(...data.map((d) => d.queries));

    return (
        <div className="flex items-end justify-between gap-2 h-32">
            {data.map((item) => (
                <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-1"
                >
                    <div
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{
                            height: `${(item.queries / maxValue) * 100}%`,
                            minHeight: "4px",
                        }}
                    />
                    <span className="text-xs text-slate-500">{item.day}</span>
                </div>
            ))}
        </div>
    );
}

export default function AdminPanel() {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-xs text-slate-500">RAG System Analytics</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-500">
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((metric) => {
                            const Icon = metric.icon;
                            return (
                                <Card key={metric.label}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-500">
                                                {metric.label}
                                            </span>
                                            <Icon className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <span className="text-2xl font-semibold text-slate-900">
                                                {metric.value}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    metric.trend === "up"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            >
                                                {metric.trend === "up" ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-1" />
                                                )}
                                                {Math.abs(metric.change)}%
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Usage Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Queries This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SimpleBarChart data={usageData} />
                            </CardContent>
                        </Card>

                        {/* Response Quality */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Response Quality</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Answered</span>
                                        <span className="font-medium">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Partial</span>
                                        <span className="font-medium">14%</span>
                                    </div>
                                    <Progress value={14} className="h-2 [&>div]:bg-amber-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Unanswered</span>
                                        <span className="font-medium">8%</span>
                                    </div>
                                    <Progress value={8} className="h-2 [&>div]:bg-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Unanswered */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    Top Unanswered Questions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-64">
                                    <div className="space-y-3">
                                        {topUnanswered.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                                            >
                                                <span className="text-sm text-slate-700 flex-1 truncate pr-4">
                                                    {item.question}
                                                </span>
                                                <Badge variant="secondary" className="shrink-0">
                                                    {item.count} times
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Recent Negative Feedback */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <ThumbsDown className="h-4 w-4" />
                                    Recent Negative Feedback
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-64">
                                    <div className="space-y-3">
                                        {recentFeedback.map((feedback) => (
                                            <div
                                                key={feedback.id}
                                                className="p-3 bg-red-50 rounded-lg border border-red-100"
                                            >
                                                <p className="text-sm font-medium text-slate-800 mb-1">
                                                    {feedback.query}
                                                </p>
                                                <p className="text-xs text-red-600 mb-2">
                                                    Reason: {feedback.reason}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {feedback.timestamp}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
