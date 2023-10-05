import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import EventCard from './EventCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

interface Props {
  title?: string
  items?: any
  marketplace?: boolean
  link?: string
  children?: any
}

gsap.registerPlugin(ScrollTrigger)

const EVENTS_LENGTH_X2 = 10

export default function SwiperEvents({ title, items, marketplace, link, children }: Props) {
  const [device, setDevice] = useState('')
  const container = useRef(null)

  const putDevice = useCallback((n: number) => {
    if (n >= 1024) {
      setDevice('ld')
    } else if (n >= 768) {
      setDevice('md')
    } else {
      setDevice('sm')
    }
  }, [])

  useEffect(() => {
    putDevice(window.innerWidth)

    window.addEventListener('resize', () => {
      putDevice(window.innerWidth)
    })

    return () =>
      window.removeEventListener('resize', () => {
        putDevice(window.innerWidth)
      })
  }, [putDevice])

  useIsomorphicLayoutEffect(() => {
    let ctx: gsap.Context
    if (container.current) {
      ctx = gsap.context((context) => {
        let firstTime = false
        ScrollTrigger.batch('.eventCard', {
          onEnter: (batch) => {
            if (!firstTime) {
              firstTime = true
              return gsap.from(batch, {
                autoAlpha: 0,
                stagger: 0.1
              })
            }
          }
        })
      }, container.current)
    }
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container}>
      {title && (
        <p className='font-bold text-2xl leading-7 px-6 py-8'>{title}</p>
      )}
      <Swiper
        spaceBetween={0}
        slidesPerView={device === 'sm' ? 2.1 : 4}
        centeredSlides
        className='eventCardContainer'
        loop
      >
        {!children && !items && new Array(EVENTS_LENGTH_X2).fill(0).map((_, index) => (
          <SwiperSlide key={index}>
            <EventCard />
          </SwiperSlide>
        ))}

        {!children && items && items.map((item: any, index: number) =>
          <SwiperSlide key={index}>
            <EventCard date={item.startDate}
              title={item.name}
              place={item.location}
              image={item.image}
              link={link ? `${link}/${item.id}` : marketplace ? `/marketplace/event-tickets/${item.id}` : `/event/${item.id}`}
            />
          </SwiperSlide>
        )}

        {children}

      </Swiper>
    </section>
  )
}
