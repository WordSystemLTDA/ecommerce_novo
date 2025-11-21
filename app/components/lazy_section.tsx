import { useEffect, useRef, useState } from "react";

export default function LazySection({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            // Quando o elemento entra na viewport (tela)
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                // Uma vez visível, desconectamos para não ficar observando à toa
                observer.disconnect();
            }
        }, {
            // Começa a carregar 100px antes de aparecer na tela para suavidade
            rootMargin: '100px'
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        // min-h evita o "layout shift" (pulo da tela)
        <div ref={domRef} className=" transition-opacity duration-500">
            {isVisible ? children : (
                // Placeholder simples enquanto carrega
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded animate-pulse">
                    <span className="text-gray-400 text-sm">Carregando...</span>
                </div>
            )}
        </div>
    );
}