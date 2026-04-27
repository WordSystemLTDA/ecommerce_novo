import { useMemo, useState, type ImgHTMLAttributes } from "react";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & {
    priority?: boolean;
    fallbackSrc?: string;
    allowNetworkLoad?: boolean;
};

export function OptimizedImage({
    src,
    alt,
    priority = false,
    fallbackSrc,
    allowNetworkLoad = true,
    decoding,
    fetchPriority,
    ...props
}: OptimizedImageProps) {
    const [hasError, setHasError] = useState(false);

    const resolvedSrc = useMemo(() => {
        if (hasError && fallbackSrc) {
            return fallbackSrc;
        }

        return src;
    }, [fallbackSrc, hasError, src]);

    return (
        <img
            {...props}
            src={allowNetworkLoad ? resolvedSrc : "data:image/gif;base64,R0lGODlhAQABAAAAACw="}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={decoding ?? "async"}
            fetchPriority={fetchPriority ?? (priority && allowNetworkLoad ? "high" : "auto")}
            onError={() => {
                if (fallbackSrc) {
                    setHasError(true);
                }
            }}
        />
    );
}
