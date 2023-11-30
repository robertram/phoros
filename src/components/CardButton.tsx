import { Loading } from "./Loading"



interface CardButtonProps {
  title: string,
  link?: string
  icon: any
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const CardButton = ({ title, link, icon, onClick, disabled, loading, className }: CardButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full rounded-[8px] shadow-2xl py-[8px] px-[15px] bg-white ${className}`}
    >
      {loading ?
        <Loading /> :
        <div className="flex m-auto justify-center">
          <div className="my-auto mr-[10px]">{icon}</div>
          <p className="text-grayed">{title}</p>
        </div>
      }
    </button>
  )
}