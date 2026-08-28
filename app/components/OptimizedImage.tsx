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
    const imageRef = useRef<HTMLImageElement>(null);
    const [hasError, setHasError] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isNearViewport, setIsNearViewport] = useState(priority);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasValidSrc = typeof src === "string" ? src.trim().length > 0 : !!src;

    // Reset error/timeout state when src changes
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setHasError(false);
        setTimedOut(false);
        setHasLoaded(false);
    }, [src]);

    // O lazy-load nativo pode antecipar imagens que ainda estão muito abaixo da
    // dobra. O observador limita o download à região próxima da tela, o que é
    // especialmente importante para fotos grandes em celulares.
    useEffect(() => {
        if (priority || !hasValidSrc || !allowNetworkLoad) {
            setIsNearViewport(priority || !hasValidSrc);
            return;
        }

        const image = imageRef.current;
        if (!image || typeof IntersectionObserver === "undefined") {
            setIsNearViewport(true);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                setIsNearViewport(true);
                observer.disconnect();
            }
        }, { rootMargin: "400px 0px" });

        observer.observe(image);
        return () => observer.disconnect();
    }, [allowNetworkLoad, hasValidSrc, priority, src]);

    const canRequestImage = allowNetworkLoad && (priority || !hasValidSrc || isNearViewport);

    // O timeout só começa quando a imagem realmente entra na fila de download.
    useEffect(() => {
        if (!canRequestImage || !hasValidSrc || hasError || timedOut || hasLoaded) return;

        // Imagens vindas do cache podem concluir antes de o useEffect executar.
        // Nesse caso o onLoad ja passou e criar um timeout faria a foto valida
        // ser substituida pelo fallback alguns segundos depois.
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth > 0) {
            setHasLoaded(true);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            const currentImage = imageRef.current;
            if (!currentImage?.complete || currentImage.naturalWidth <= 0) {
                setTimedOut(true);
            }
            timeoutRef.current = null;
        }, timeoutMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [src, canRequestImage, hasValidSrc, hasError, hasLoaded, timedOut, timeoutMs]);

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
            ref={imageRef}
            src={canRequestImage ? resolvedSrc : "data:image/gif;base64,R0lGODlhAQABAAAAACw="}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={decoding ?? "async"}
            fetchPriority={fetchPriority ?? (priority && allowNetworkLoad ? "high" : "auto")}
            onLoad={canRequestImage ? (event) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                setHasLoaded(true);
                if (onLoad) onLoad(event);
            } : undefined}
            onError={canRequestImage ? (event) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                if (fallbackSrc && !hasError) {
                    setHasError(true);
                }
                if (onError) {
                    onError(event);
                }
            } : undefined}
        />
    );
}
