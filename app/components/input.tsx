
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export default function CustomInput(props: CustomInputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-0 border-b border-primary/30 py-3 px-0 text-sm text-primary placeholder:italic placeholder:text-primary/70/60 focus:border-terciary focus:outline-none transition-colors duration-500 ${props.className ?? ''}`}
    />
  )
}

