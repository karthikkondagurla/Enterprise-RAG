"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeedbackControlsProps {
    onFeedback?: (type: "positive" | "negative") => void;
    disabled?: boolean;
}

export function FeedbackControls({
    onFeedback,
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
            </div>
        </TooltipProvider>
    );
}
