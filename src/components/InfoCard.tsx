import { Loading } from "./Loading"

interface CardButtonProps {
  title: string,
  value?: string
  link?: string
  icon?: any
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const InfoCard = ({ title, value, link, icon, onClick, disabled, loading, className }: CardButtonProps) => {
  return (
    <div
      className={`w-full rounded-[8px] py-[8px] px-[15px] bg-white border-solid border-[1px] border-[#D4D4D4] ${className}`}
    >
      {loading ?
        <Loading /> :
        <>
          <p className="font-bold text-xl text-center">{value}</p>
          <p className="text-base text-center">{title}</p>
        </>
      }
    </div>
  )
}