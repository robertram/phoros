import { useState } from 'react'
import moment from 'moment';
import { useRouter } from 'next/navigation';

interface Props {
  items: any
}

export default function HeroCarousel({ items }: Props) {
  const { push } = useRouter();
  const [slide, setSlide] = useState<number>(0)

  return (
    <div className='p-10 z-10'>
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96 p-7">
          {items.map((item: any, index: number) => {
            const link = `/event/${item.id}`
            const formattedDate = item.startDate ? moment(item.startDate).format('MMMM Do YYYY') : ''
            return (
              <div
                className={`duration-700 ease-in-out cursor-pointer ${slide === index ? "block" : "hidden"}`}
                data-carousel-item
                key={index}
                onClick={() => {
                  if (link) push(link);
                }}>
                <img src={item.image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-full object-cover" alt="hero event image" />
                <div className="absolute left-[50px] bottom-[20px]">
                  <h3 className='text-white text-3xl'>{item.name}</h3>
                  <p className='text-white text-1xl'>{formattedDate}</p>
                </div>

              </div>
            )
          })}
        </div>
        <div className="absolute z-10 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          {items.map((item: any, index: number) => {
            return (
              <button
                key={index}
                type="button"
                className="w-3 h-3 rounded-full bg-white"
                aria-current="true"
                aria-label={`Slide ${index}`}
                data-carousel-slide-to={index}
                onClick={() => { setSlide(index); }}
              ></button>
            )
          })}
        </div>
        <button
          type="button"
          className="absolute top-0 left-0 z-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={() => {
            if (slide > 0) {
              setSlide(slide - 1);
            } else {
              setSlide(items.length - 1);
            }
          }}
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30  group-hover:bg-white/50  group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 right-0 z-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={() => {
            if (slide !== items.length - 1) {
              setSlide(slide + 1);
            } else {
              setSlide(0);
            }
          }}
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50  group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-white sm:w-6 sm:h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>

  )
}
