// --- Select Customizado (NOVO) ---
interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export default function CustomSelect(props: CustomSelectProps) {
    return (
        <select
            {...props}
            className="w-full rounded-md border border-gray-400 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
            {props.children}
        </select>
    )
}