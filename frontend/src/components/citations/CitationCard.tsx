"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Citation } from "@/types";

interface CitationCardProps {
    citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Extract filename from path
    const filename = citation.source.split(/[/\\]/).pop() || citation.source;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="border-slate-200 overflow-hidden">
                <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-medium text-slate-700 truncate">
                                {filename}
                            </span>
                            <Badge variant="secondary" className="text-xs shrink-0">
                                {Math.round(citation.score * 100)}% match
                            </Badge>
                        </div>
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="px-3 pb-3 space-y-2">
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                                {citation.content}
                            </p>
                        </div>
                        {citation.lastUpdated && (
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>Updated: {citation.lastUpdated}</span>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
