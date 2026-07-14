type PlaceholderVariant = "product" | "banner" | "category" | "brand";

const VARIANT_CONFIG: Record<
    PlaceholderVariant,
    {
        width: number;
        height: number;
        title: string;
        accent: string;
        background: string;
    }
> = {
    product: {
        width: 640,
        height: 640,
        title: "Produto sem imagem",
        accent: "#0f172a",
        background: "#f8fafc",
    },
    banner: {
        width: 1440,
        height: 420,
        title: "Banner indisponivel",
        accent: "#7c2d12",
        background: "#fff7ed",
    },
    category: {
        width: 520,
        height: 320,
        title: "Categoria sem imagem",
        accent: "#164e63",
        background: "#ecfeff",
    },
    brand: {
        width: 520,
        height: 300,
        title: "Marca sem imagem",
        accent: "#78350f",
        background: "#fffbeb",
    },
};

function escapeSvgText(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function createPlaceholder(variant: PlaceholderVariant, name?: string) {
    const config = VARIANT_CONFIG[variant];
    const escapedTitle = escapeSvgText(name || config.title);
    const iconSize = variant === "banner" ? 72 : 96;
    const centerX = config.width / 2;
    const centerY = config.height / 2;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${config.width} ${config.height}" role="img" aria-label="${escapedTitle}">
            <defs>
                <linearGradient id="surface" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="${config.background}" />
                    <stop offset="100%" stop-color="#ffffff" />
                </linearGradient>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path d="M48 0H0v48" fill="none" stroke="${config.accent}" stroke-opacity="0.08" />
                </pattern>
            </defs>
            <rect width="${config.width}" height="${config.height}" fill="url(#surface)" />
            <rect width="${config.width}" height="${config.height}" fill="url(#grid)" />
            <rect x="28" y="28" width="${config.width - 56}" height="${config.height - 56}" rx="28" fill="#ffffff" stroke="${config.accent}" stroke-opacity="0.14" />
            <g transform="translate(${centerX - iconSize / 2} ${centerY - iconSize * 0.95})" opacity="0.82">
                <rect x="4" y="${iconSize * 0.18}" width="${iconSize * 0.92}" height="${iconSize * 0.62}" rx="14" fill="none" stroke="${config.accent}" stroke-width="6" />
                <circle cx="${iconSize * 0.32}" cy="${iconSize * 0.36}" r="${iconSize * 0.08}" fill="${config.accent}" opacity="0.35" />
                <path d="M14 ${iconSize * 0.72}l${iconSize * 0.22}-${iconSize * 0.22} ${iconSize * 0.16} ${iconSize * 0.16} ${iconSize * 0.26}-${iconSize * 0.28} ${iconSize * 0.2} ${iconSize * 0.22}" fill="none" stroke="${config.accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
            </g>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getProductImageFallback(name?: string) {
    return createPlaceholder("product", name);
}

export function getBannerImageFallback(name?: string) {
    return createPlaceholder("banner", name);
}

export function getCategoryImageFallback(name?: string) {
    return createPlaceholder("category", name);
}

export function getBrandImageFallback(name?: string) {
    return createPlaceholder("brand", name);
}
