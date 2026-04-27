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

const accentClasses: Record<NonNullable<SectionHeaderProps["accent"]>, string> = {
    primary: "from-primary/10 to-primary/0 text-primary",
    terciary: "from-terciary/15 to-terciary/0 text-terciary",
    rose: "from-rose-500/15 to-rose-500/0 text-rose-600",
    amber: "from-amber-400/20 to-amber-400/0 text-amber-700",
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-700",
};

export function SectionHeader({
    eyebrow,
    title,
    description,
    icon,
    accent = "primary",
    onLinkClick,
    linkLabel = "Ver todos",
}: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between gap-4 px-4 lg:px-12 mt-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
                {icon && (
                    <div
                        className={`hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br ${accentClasses[accent]} shadow-sm`}
                    >
                        {icon}
                    </div>
                )}
                <div className="min-w-0">
                    {eyebrow && (
                        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500">
                            {eyebrow}
                        </p>
                    )}
                    <h2 className="text-base lg:text-xl font-semibold text-slate-900 truncate">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-xs lg:text-sm text-slate-500 truncate">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {onLinkClick && (
                <button
                    type="button"
                    onClick={onLinkClick}
                    className="shrink-0 text-xs lg:text-sm font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
                >
                    {linkLabel}
                    <span aria-hidden> ›</span>
                </button>
            )}
        </div>
    );
}
