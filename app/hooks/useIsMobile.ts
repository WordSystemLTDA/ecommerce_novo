import { useState, useEffect } from "react";

export function useIsMobile() {
  // Define um valor padrão (geralmente false para desktop first ou true para mobile first)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para verificar a largura
    const checkIsMobile = () => {
      // 768px é o padrão comum para tablets/celulares (Tailwind md)
      setIsMobile(window.innerWidth < 768);
    };

    // Verifica no momento que carrega
    checkIsMobile();

    // Adiciona um ouvinte para caso o usuário redimensione a tela
    window.addEventListener("resize", checkIsMobile);

    // Limpa o ouvinte ao desmontar
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}