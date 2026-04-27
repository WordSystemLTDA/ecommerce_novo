export function SkeletonProductCard() {
    return (
        <div className="flex flex-col h-full border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="relative">
                <div className="w-full h-48 shimmer"></div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div className="flex-1 space-y-2">
                    <div className="h-4 shimmer rounded w-3/4"></div>
                    <div className="h-4 shimmer rounded w-1/2"></div>

                    <div className="flex justify-between pt-1">
                        <div className="h-3 shimmer rounded w-1/4"></div>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <div className="h-6 shimmer rounded w-1/3"></div>
                    </div>

                    <div className="h-3 shimmer rounded w-1/2 mt-1"></div>
                </div>

                <div className="flex gap-1">
                    <div className="w-10 h-9 shimmer rounded"></div>
                    <div className="flex-1 h-9 shimmer rounded"></div>
                </div>
            </div>
        </div>
    );
}
