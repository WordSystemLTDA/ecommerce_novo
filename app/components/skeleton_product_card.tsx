import React from 'react';

export function SkeletonProductCard() {
    return (
        <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white animate-pulse">
            <div className="relative">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gray-200 p-4"></div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex-1">
                    {/* Title placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                    {/* Price placeholder */}
                    <div className="flex justify-between mb-2">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>

                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>

                {/* Button placeholder */}
                <div className="mt-4 w-full h-8 bg-gray-200 rounded-sm"></div>
            </div>
        </div>
    );
}
