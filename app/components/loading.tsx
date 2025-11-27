export default function Loading({titulo, subtitulo}: {titulo: string, subtitulo: string}) {
    return (
        <div className="fixed inset-0 z-9999 flex min-h-screen w-full flex-col items-center justify-center bg-white">
            {/* Container do Spinner */}
            <div className="relative flex items-center justify-center">
                {/* Anel externo (fundo) */}
                <div className="h-16 w-16 rounded-full border-4 border-gray-100"></div>

                {/* Anel interno (girando) - Usa a cor primary definida no seu tema */}
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>

            {/* Texto de carregamento com pulsação */}
            <div className="mt-4 flex flex-col items-center gap-1">
                <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
                <p className="animate-pulse text-xs text-gray-500">{subtitulo}</p>
            </div>
        </div>
    );
}