import { AiOutlineCopy } from 'react-icons/ai';

interface CardProps {
  title: string
  description?: string
  fullDescription?: string
}

export const Card = ({ title, description, fullDescription }: CardProps) => {
  return (
    <div className='card w-full max-w-[300px] border-solid border-red-500 border-0 rounded-[8px] p-[15px] bg-black '>
      <p className='text-2xl'>{title}</p>
      {description && <div className='flex'>
        <p className='text-base mr-[5px]'>{description}</p>
        {fullDescription &&
          <button 
          className='flex'
          onClick={() => { navigator.clipboard.writeText(fullDescription) }}
          >
            <AiOutlineCopy size={20} />
          </button>
        }
      </div>}


    </div>
  )
}