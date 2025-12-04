import CustomInput from "./input"


interface InputIEProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isento: boolean
    onIsentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputIE({ isento, onIsentoChange, ...props }: InputIEProps) {
    return (
        <div className="relative">
            <CustomInput
                {...props}
                type="text"
                placeholder="IE"
                disabled={isento}
            />
            <label className="absolute right-3 top-1/3 -translate-y-1-2 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={isento}
                    onChange={onIsentoChange}
                    className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-500"
                />
                ISENTO
            </label>
        </div>
    )
}