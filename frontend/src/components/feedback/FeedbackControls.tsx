"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeedbackControlsProps {
    onFeedback?: (type: "positive" | "negative") => void;
    onEscalate?: () => void;
    disabled?: boolean;
}

export function FeedbackControls({
    onFeedback,
    onEscalate,
    disabled = false,
}: FeedbackControlsProps) {
    return (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            onClick={() => onFeedback?.("positive")}
                            disabled={disabled}
                            aria-label="Mark as helpful"
                        >
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">This was helpful</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onFeedback?.("negative")}
                            disabled={disabled}
                            aria-label="Mark as not helpful"
                        >
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Not helpful</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs text-slate-600 hover:text-blue-600 hover:border-blue-300"
                            onClick={onEscalate}
                            disabled={disabled}
                        >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Talk to Human
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Connect with a support agent</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
