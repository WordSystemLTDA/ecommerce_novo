import type { ReactNode } from "react";

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    icon?: ReactNode;
    accent?: "primary" | "terciary" | "rose" | "amber" | "emerald";
    onLinkClick?: () => void;
    linkLabel?: string;
}

export function SectionHeader({
    eyebrow,
    title,
    description,
    onLinkClick,
    linkLabel = "Ver todos",
}: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between gap-4 px-4 lg:px-12 mt-2 mb-6 border-t border-primary/10 pt-8">
            <div className="min-w-0">
                {eyebrow && (
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-primary/30" aria-hidden />
                        <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-primary/70">
                            {eyebrow}
                        </p>
                    </div>
                )}
                <h2
                    className="text-2xl lg:text-4xl font-serif font-normal text-primary leading-tight"
                    style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}
                >
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-primary/70 mt-2 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {onLinkClick && (
                <button
                    type="button"
                    onClick={onLinkClick}
                    className="shrink-0 text-[10px] uppercase tracking-[0.2em] font-medium text-primary border-b border-primary pb-0.5 hover:border-terciary hover:text-terciary transition-colors duration-500 whitespace-nowrap"
                >
                    {linkLabel}
                </button>
            )}
        </div>
    );
}


