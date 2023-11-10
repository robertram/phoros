interface PoapCardProps {
  image?: string
  name?: string
  selected?: boolean
  onClick?: () => void
}

export const PoapCard = ({ name, image, selected, onClick }: PoapCardProps) => {
  return (
    <button
      onClick={onClick ? (e) => {
        e.preventDefault()
        onClick()
      } : () => { }}
      className={`h-min w-[48%] max-w-[300px] rounded-[8px] drop-shadow-xl mb-[10px] ${selected ? 'bg-primary !text-white' : ''}`}>
      <div className="m-[3px]">
        <img src={image} alt={name ?? ''} className=" mx-auto rounded-t-[8px] h-[170px] object-cover bg-white" />
      </div>
      <p className="p-[5px] text-base font-medium text-left whitespace-nowrap overflow-hidden overflow-ellipsis">{name}</p>
    </button>
  )
}