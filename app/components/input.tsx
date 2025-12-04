
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }


export default function CustomInput(props: CustomInputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-gray-400 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-terciary focus:outline-none focus:ring-1 focus:ring-terciary"
    />
  )
}
