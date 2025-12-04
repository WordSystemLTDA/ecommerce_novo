import CustomInput from "./input"
import { FiEye, FiEyeOff } from 'react-icons/fi'


interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    show: boolean
    onToggle: () => void
}

export default function PasswordInput({ show, onToggle, ...props }: PasswordInputProps) {
    return (
        <div className="relative">
            <CustomInput
                {...props}
                type={show ? 'text' : 'password'}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1-2 -translate-y-1-2 text-gray-500 hover:text-gray-900"
                aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
            >
                {show ? <FiEyeOff /> : <FiEye />}
            </button>
        </div>
    )
}