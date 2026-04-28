
interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export default function CustomSelect(props: CustomSelectProps) {
    return (
        <select
            {...props}
            className={`w-full appearance-none bg-transparent border-0 border-b border-primary/30 py-3 px-0 pr-6 text-sm text-primary focus:border-terciary focus:outline-none transition-colors duration-500 ${props.className ?? ''}`}
        >
            {props.children}
        </select>
    )
}