import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
    children: React.ReactNode;
    forceVisible?: boolean;
    minHeight?: number;
    rootMargin?: string;
    className?: string;
}

export default function LazySection({
    children,
    forceVisible = false,
    minHeight = 200,
    rootMargin = '350px 0px',
    className = '',
}: LazySectionProps) {
    const [isVisible, setIsVisible] = useState(forceVisible);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (forceVisible) {
            setIsVisible(true);
            return;
        }

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, {
            rootMargin
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => observer.disconnect();
    }, [forceVisible, rootMargin]);

    return (
        <div ref={domRef} className={`transition-opacity duration-300 ${className}`}>
            {isVisible ? children : (
                <div
                    aria-hidden="true"
                    className="w-full animate-pulse border border-primary/5 bg-product-bg/60"
                    style={{ minHeight }}
                />
            )}
        </div>
    );
}
