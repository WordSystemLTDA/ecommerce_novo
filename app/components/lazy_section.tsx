import { useEffect, useRef, useState } from "react";

export default function LazySection({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, {
            rootMargin: '100px'
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={domRef} className=" transition-opacity duration-500">
            {isVisible ? children : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded animate-pulse">
                    <span className="text-gray-400 text-sm">Carregando...</span>
                </div>
            )}
        </div>
    );
}