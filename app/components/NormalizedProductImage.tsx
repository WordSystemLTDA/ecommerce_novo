import { useCallback, useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";
import { OptimizedImage } from "./OptimizedImage";

type ContentBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
};

interface NormalizedProductImageProps {
    src?: string;
    alt: string;
    fallbackSrc?: string;
    allowNetworkLoad?: boolean;
    contentInset?: number;
    normalizeContent?: boolean;
    isLoading?: boolean;
    onLoad?: () => void;
}

const boundsCache = new Map<string, ContentBounds | null>();
const MAX_SAMPLE_SIZE = 256;
const BACKGROUND_TOLERANCE = 40;
const defaultImageLayout: CSSProperties = {
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
};

function getCornerColors(data: Uint8ClampedArray, width: number, height: number) {
    const sampleSize = Math.max(2, Math.round(Math.min(width, height) * 0.025));
    const corners = [
        [0, 0],
        [width - sampleSize, 0],
        [0, height - sampleSize],
        [width - sampleSize, height - sampleSize],
    ];

    return corners.map(([startX, startY]) => {
        let red = 0;
        let green = 0;
        let blue = 0;
        let alpha = 0;
        let count = 0;

        for (let y = startY; y < startY + sampleSize; y += 1) {
            for (let x = startX; x < startX + sampleSize; x += 1) {
                const index = (y * width + x) * 4;
                red += data[index];
                green += data[index + 1];
                blue += data[index + 2];
                alpha += data[index + 3];
                count += 1;
            }
        }

        return {
            red: red / count,
            green: green / count,
            blue: blue / count,
            alpha: alpha / count,
        };
    });
}

function analyzeContentBounds(image: HTMLImageElement): ContentBounds | null {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    if (!naturalWidth || !naturalHeight) return null;

    const sampleScale = Math.min(1, MAX_SAMPLE_SIZE / Math.max(naturalWidth, naturalHeight));
    const width = Math.max(1, Math.round(naturalWidth * sampleScale));
    const height = Math.max(1, Math.round(naturalHeight * sampleScale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return null;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    let pixels: Uint8ClampedArray;
    try {
        pixels = context.getImageData(0, 0, width, height).data;
    } catch {
        return null;
    }

    const cornerColors = getCornerColors(pixels, width, height);
    const hasTransparentBackground = cornerColors.filter((color) => color.alpha < 32).length >= 2;
    const rowCounts = new Uint16Array(height);
    const columnCounts = new Uint16Array(width);
    const toleranceSquared = BACKGROUND_TOLERANCE * BACKGROUND_TOLERANCE;

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;
            const alpha = pixels[index + 3];
            let isForeground = alpha > 20;

            if (isForeground && !hasTransparentBackground) {
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const closestBackgroundDistance = cornerColors.reduce((closest, background) => {
                    const redDifference = red - background.red;
                    const greenDifference = green - background.green;
                    const blueDifference = blue - background.blue;
                    const distance = redDifference ** 2 + greenDifference ** 2 + blueDifference ** 2;
                    return Math.min(closest, distance);
                }, Number.POSITIVE_INFINITY);

                isForeground = closestBackgroundDistance > toleranceSquared;
            }

            if (isForeground) {
                rowCounts[y] += 1;
                columnCounts[x] += 1;
            }
        }
    }

    const minimumPixelsPerRow = Math.max(2, Math.round(width * 0.005));
    const minimumPixelsPerColumn = Math.max(2, Math.round(height * 0.005));
    const firstRow = rowCounts.findIndex((count) => count >= minimumPixelsPerRow);
    const firstColumn = columnCounts.findIndex((count) => count >= minimumPixelsPerColumn);

    if (firstRow === -1 || firstColumn === -1) return null;

    let lastRow = height - 1;
    let lastColumn = width - 1;

    while (lastRow > firstRow && rowCounts[lastRow] < minimumPixelsPerRow) lastRow -= 1;
    while (lastColumn > firstColumn && columnCounts[lastColumn] < minimumPixelsPerColumn) lastColumn -= 1;

    const padding = 2;
    const left = Math.max(0, firstColumn - padding);
    const top = Math.max(0, firstRow - padding);
    const right = Math.min(width, lastColumn + padding + 1);
    const bottom = Math.min(height, lastRow + padding + 1);
    const scaleX = naturalWidth / width;
    const scaleY = naturalHeight / height;

    return {
        x: left * scaleX,
        y: top * scaleY,
        width: (right - left) * scaleX,
        height: (bottom - top) * scaleY,
        naturalWidth,
        naturalHeight,
    };
}

function getImageLayout(bounds: ContentBounds, frame: HTMLDivElement, contentInset?: number): CSSProperties | undefined {
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;

    if (!frameWidth || !frameHeight) return undefined;

    const inset = contentInset ?? (frameWidth < 180 ? 14 : 20);
    const availableWidth = Math.max(1, frameWidth - inset * 2);
    const availableHeight = Math.max(1, frameHeight - inset * 2);
    const scale = Math.min(availableWidth / bounds.width, availableHeight / bounds.height);
    const contentCenterX = bounds.x + bounds.width / 2;
    const contentCenterY = bounds.y + bounds.height / 2;

    return {
        width: bounds.naturalWidth * scale,
        height: bounds.naturalHeight * scale,
        left: frameWidth / 2 - contentCenterX * scale,
        top: frameHeight / 2 - contentCenterY * scale,
        maxWidth: "none",
        maxHeight: "none",
        objectFit: "fill",
        padding: 0,
    };
}

export function NormalizedProductImage({
    src,
    alt,
    fallbackSrc,
    allowNetworkLoad = true,
    contentInset,
    normalizeContent = true,
    isLoading = false,
    onLoad,
}: NormalizedProductImageProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const boundsRef = useRef<ContentBounds | null>(null);
    const [imageLayout, setImageLayout] = useState<CSSProperties>();
    const [hasContentBounds, setHasContentBounds] = useState(false);

    const updateLayout = useCallback(() => {
        if (!boundsRef.current || !frameRef.current) return;
        setImageLayout(getImageLayout(boundsRef.current, frameRef.current, contentInset));
    }, [contentInset]);

    useEffect(() => {
        boundsRef.current = null;
        setImageLayout(undefined);
        setHasContentBounds(false);
    }, [src, allowNetworkLoad, normalizeContent]);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame || !hasContentBounds || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(updateLayout);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [hasContentBounds, updateLayout]);

    const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;

        const loadedSource = image.currentSrc || image.src;
        const loadedFallback = !!fallbackSrc && loadedSource === fallbackSrc;

        if (normalizeContent && allowNetworkLoad && !loadedFallback) {
            const cacheKey = loadedSource;
            let bounds = boundsCache.get(cacheKey);

            if (bounds === undefined) {
                bounds = analyzeContentBounds(image);
                boundsCache.set(cacheKey, bounds);
            }

            boundsRef.current = bounds;
            setHasContentBounds(!!bounds);
            updateLayout();
        }

        onLoad?.();
    };

    return (
        <div ref={frameRef} className="absolute inset-0 h-full w-full overflow-hidden">
            <OptimizedImage
                src={src}
                alt={alt}
                fallbackSrc={fallbackSrc}
                allowNetworkLoad={allowNetworkLoad}
                crossOrigin="anonymous"
                className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 sm:p-5 ${isLoading ? "opacity-0" : "opacity-100"}`}
                style={imageLayout ?? {
                    ...defaultImageLayout,
                    ...(contentInset === undefined ? {} : { padding: contentInset }),
                }}
                onLoad={handleLoad}
            />
        </div>
    );
}
