import type { IconType } from "react-icons"

interface IconCircleProps {
  icon: IconType
  color: 'primary' | 'secondary' | 'red' | 'green'
}

export default function IconCircle({ icon: Icon, color }: IconCircleProps) {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    red: 'bg-red-600',
    green: 'bg-green-500',
  }
  return (
    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colorClasses[color]}`}>
      <Icon className="text-3xl text-white" />
    </div>
  )
}