
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' | 'secondary' | 'primaryOutline' | 'secondaryOutline' | 'blue' | 'greenOutline' | 'grayOutline'
}

export default function Button({ variant, children, ...props }: ButtonProps) {
    if (variant === 'primary') {
        return (
            <button
                {...props}
                className={`btn-luxury-primary h-12 px-8 text-xs font-medium tracking-[0.2em] uppercase w-full ${props.className ?? ''}`}
            >
                <span className="btn-gold-overlay" aria-hidden />
                <span className="btn-content flex items-center justify-center gap-2">{children}</span>
            </button>
        );
    }

    const variants: Record<string, string> = {
        secondary: 'border border-primary bg-transparent text-primary hover:bg-primary hover:text-secondary transition-colors duration-500',
        primaryOutline: 'border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-500',
        secondaryOutline: 'border border-primary text-primary hover:bg-primary hover:text-secondary transition-colors duration-500',
        blue: 'bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300',
        greenOutline: 'bg-(--dynamic-success-bg) hover:bg-(--dynamic-success) text-(--dynamic-success-strong) hover:text-white border border-(--dynamic-success) transition-colors duration-300',
        grayOutline: 'bg-secondary hover:bg-secondary/90 text-primary border border-primary/20 disabled:opacity-50 transition-colors duration-300',
    };

    return (
        <button
            {...props}
            className={`cursor-pointer flex w-full items-center justify-center gap-2 h-12 px-8 text-xs font-medium tracking-[0.2em] uppercase focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${variants[variant]} ${props.className ?? ''}`}
        >
            {children}
        </button>
    );
}

