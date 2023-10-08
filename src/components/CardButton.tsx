import { Loading } from "./Loading"

interface CardButtonProps {
  title: string,
  link?: string
  icon: any
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export const CardButton = ({ title, link, icon, onClick, disabled, loading }: CardButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className="w-full rounded-[8px] shadow-2xl py-[8px] px-[15px] "
    >
      {loading ?
        <Loading /> :
        <>
          <div className="m-auto">{icon}</div>
          <p>{title}</p>
        </>
      }
    </button>
  )
}