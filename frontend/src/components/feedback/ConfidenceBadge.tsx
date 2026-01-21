"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceBadgeProps {
    confidence: number; // 0-1
    showLabel?: boolean;
}

export function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
    const percentage = Math.round(confidence * 100);

    // Determine confidence level
    const level =
        percentage >= 80 ? "high" : percentage >= 50 ? "medium" : "low";

    const config = {
        high: {
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            progressColor: "[&>div]:bg-emerald-500",
            icon: CheckCircle,
            label: "High Confidence",
        },
        medium: {
            color: "text-amber-600",
            bgColor: "bg-amber-100",
            progressColor: "[&>div]:bg-amber-500",
            icon: HelpCircle,
            label: "Medium Confidence",
        },
        low: {
            color: "text-red-600",
            bgColor: "bg-red-100",
            progressColor: "[&>div]:bg-red-500",
            icon: AlertCircle,
            label: "Low Confidence",
        },
    };

    const { color, bgColor, progressColor, icon: Icon, label } = config[level];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                        <div className={cn("p-1 rounded-full", bgColor)}>
                            <Icon className={cn("h-3 w-3", color)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Progress
                                value={percentage}
                                className={cn("w-16 h-1.5", progressColor)}
                            />
                            {showLabel && (
                                <span className={cn("text-xs font-medium", color)}>
                                    {percentage}%
                                </span>
                            )}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">
                        {label} - Answer based on {percentage}% relevant context
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
