// --- Botão Customizado (Versão desta página) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' |  'secondary' | 'primaryOutline' | 'secondaryOutline' | 'blue' | 'greenOutline' | 'grayOutline'
}

export default function Button({ variant, children, ...props }: ButtonProps) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-secondary',
        secondary: 'bg-secondary text-white hover:bg-primary',
        primaryOutline: 'border border-primary text-primary hover:text-secondary',
        secondaryOutline: 'border border-secondary text-secondary hover:text-primary',
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        greenOutline:
            'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300',
        grayOutline: 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-400',
    }

    return (
        <button
            {...props}
            className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-md p-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${props.className}`}
        >
            {children}
        </button>
    )
}