interface SkeletonBannerProps {
    aspect?: string; // tailwind aspect-* class
    rounded?: string; // tailwind rounded-* class
    className?: string;
}

export function SkeletonBanner({
    aspect = "aspect-[16/7]",
    rounded = "rounded-2xl",
    className = "",
}: SkeletonBannerProps) {
    return (
        <div
            className={`w-full ${aspect} ${rounded} shimmer overflow-hidden ${className}`}
            aria-hidden="true"
        />
    );
}

export function SkeletonMainBanner() {
    return (
        <div className="w-full relative">
            <div className="w-full h-[200px] md:h-[300px] lg:h-[450px] shimmer" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <span
                        key={i}
                        className={`block h-1.5 rounded-full bg-white/70 ${i === 0 ? "w-6" : "w-1.5"}`}
                    />
                ))}
            </div>
        </div>
    );
}

export function SkeletonImageCard({
    width = "min-w-53 max-w-53",
    height = "h-32",
}: {
    width?: string;
    height?: string;
}) {
    return (
        <div className={`flex flex-col items-center gap-2 ${width}`}>
            <div className={`w-full ${height} rounded-xl shimmer`} aria-hidden="true" />
            <div className="w-3/4 h-3 rounded-full shimmer" aria-hidden="true" />
        </div>
    );
}
