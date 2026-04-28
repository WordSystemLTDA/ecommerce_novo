import { useEffect, useMemo, useRef, useState, type ImgHTMLAttributes } from "react";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & {
    priority?: boolean;
    fallbackSrc?: string;
    allowNetworkLoad?: boolean;
    timeoutMs?: number;
};

export function OptimizedImage({
    src,
    alt,
    priority = false,
    fallbackSrc,
    allowNetworkLoad = true,
    decoding,
    fetchPriority,
    onError,
    onLoad,
    timeoutMs = 12000,
    ...props
}: OptimizedImageProps) {
    const [hasError, setHasError] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasValidSrc = typeof src === "string" ? src.trim().length > 0 : !!src;

    // Reset error/timeout state when src changes
    useEffect(() => {
        setHasError(false);
        setTimedOut(false);
    }, [src]);

    // Timeout: if image hasn't loaded/errored within timeoutMs, use fallback
    useEffect(() => {
        if (!allowNetworkLoad || !hasValidSrc || hasError || timedOut) return;

        timeoutRef.current = setTimeout(() => {
            setTimedOut(true);
        }, timeoutMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [src, allowNetworkLoad, hasValidSrc, hasError, timedOut, timeoutMs]);

    const resolvedSrc = useMemo(() => {
        if ((!hasValidSrc || hasError || timedOut) && fallbackSrc) {
            return fallbackSrc;
        }
        if (!hasValidSrc || hasError || timedOut) {
            return undefined;
        }
        return src;
    }, [fallbackSrc, hasError, hasValidSrc, src, timedOut]);

    return (
        <img
            {...props}
            src={allowNetworkLoad ? resolvedSrc : "data:image/gif;base64,R0lGODlhAQABAAAAACw="}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={decoding ?? "async"}
            fetchPriority={fetchPriority ?? (priority && allowNetworkLoad ? "high" : "auto")}
            onLoad={(event) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (onLoad) onLoad(event);
            }}
            onError={(event) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (fallbackSrc && !hasError) {
                    setHasError(true);
                }
                if (onError) {
                    onError(event);
                }
            }}
        />
    );
}
