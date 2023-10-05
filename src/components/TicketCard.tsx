import { ThirdwebNftMedia } from '@thirdweb-dev/react';
import moment from 'moment';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiFillWarning, AiFillEye, AiFillEdit, AiOutlineSetting } from 'react-icons/ai';

interface Props {
  date?: string
  title?: string
  place?: string
  details?: string
  image?: string
  link?: string
  onClick?: () => void
  className?: string
  thirdwebMetadata?: any
  previewLink?: string
  editLink?: string
  eventInfoLink?: string
}

export default function TicketCard({
  date,
  title,
  place,
  details,
  image = undefined,
  link,
  onClick,
  className = '',
  thirdwebMetadata,
  previewLink,
  editLink,
  eventInfoLink
}: Props) {
  const { push } = useRouter();
  const formattedDate = date ? moment(date).format('MMMM Do YYYY h:mm A') : ''

  const getShortTitle = (title?: string) => {
    if (!title) return ''
    if (title.length > 40) {
      var words = title.split(" ");
      var result = words.slice(0, 6).join(" ");
      return `${result}...`
    }
    return title
  }

  return (
    <div
      onClick={onClick ? onClick : () => {
        link ? push(link ?? "") : ''
      }}
      className={`relative w-[163px] h-[250px] md:min-w-[max(202px,18vw)] md:min-h-[max(268px,26.5vw)] rounded-lg scale-90 transition-transform duration-300  eventCard ${link ? 'hover:scale-95 cursor-pointer' : ''} ${className}`}>
      {thirdwebMetadata ?
        <ThirdwebNftMedia
          metadata={thirdwebMetadata}
          height='100%'
          width='100%'
        />
        :
        <div
          style={{ backgroundImage: image ? `url(${image})` : 'url()' }}
          className='bg-[url("/cardImage.jpg")] bg-center bg-cover w-full h-full absolute rounded-lg' />}
      <div className='absolute w-full h-full bg-gradient-to-b to-[#1E1E1E] from-transparent from-50% rounded-lg' />

      {previewLink &&
        <Link href={previewLink} className='absolute left-2 top-2 cursor-pointer drop-shadow-md'>
          <AiFillEye
            size={20}
          />
        </Link>
      }

      {editLink &&
        <Link href={editLink ?? ''} className='absolute left-8 top-2 cursor-pointer drop-shadow-md'>
          <AiFillEdit
            size={20}
          />
        </Link>
      }

      {eventInfoLink &&
        <Link href={eventInfoLink} className='absolute right-8 top-2 cursor-pointer drop-shadow-md'>
          <AiOutlineSetting
            size={20}
          />
        </Link>
      }

      <div className='absolute bottom-3 left-3'>
        {formattedDate && <div className='text-[var(--text-description-dark)] md:text-[var(--text-description-light)] text-[12px]'>{formattedDate}</div>}
        <div className='text-[18px] hidden lg:block'>{title}</div>
        <div className='text-[18px] lg:hidden block'>{getShortTitle(title)}</div>
        <div className='text-[var(--text-description)] text-[14px]'>
          {place}
        </div>
        {details && <div className='text-[var(--text-description)] text-[14px]'>
          {details}
        </div>}
      </div>
      {/* <div className='absolute w-8 h-8 flex items-center justify-center right-4 top-4 rounded-[50%] bg-[#4E4E4E99]'>
        <Image
          src='/favorite.png'
          width={16}
          height={16}
          alt='favorite'
        />
      </div> */}
    </div>
  )
}
