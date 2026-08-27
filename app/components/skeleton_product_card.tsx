export function SkeletonProductCard() {
    return (
        <div className="flex h-full w-full flex-col overflow-hidden border-t border-primary/15 bg-product-bg">
            <div className="relative h-40 shrink-0 sm:h-48">
                <div className="h-full w-full shimmer"></div>
            </div>

            <div className="flex min-h-[12.75rem] flex-1 flex-col border-t border-primary/8 p-3 lg:p-4">
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

                <div className="mt-auto flex gap-0.5 pt-2">
                    <div className="h-10 w-10 shrink-0 shimmer"></div>
                    <div className="h-10 flex-1 shimmer"></div>
                </div>
            </div>
        </div>
    );
}
