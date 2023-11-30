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

export const LinkCard = ({ title, value, link, icon, onClick, disabled, loading, className }: CardButtonProps) => {
  return (
    <a
      href={link ?? '#'}
      target="_blank"
      rel="noreferrer"
      className={`w-full rounded-[8px] py-[8px] px-[15px] bg-[white] border-solid border-[1px] border-[#D4D4D4] ${className}`}
    >
      {value && <p className="font-bold text-xl text-center">{value}</p>}
      <div className="flex justify-center">
        {icon && <div className="my-auto mr-[5px]">{icon}</div>}
        <p className="text-base text-center text-grayed">{title}</p>
      </div>
    </a>
  )
}