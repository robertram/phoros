import React from "react";
import EventCard from "./EventCard";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';

interface Props {
  title?: string
  items?: any
  marketplace?: boolean
  link?: string
  children?: any
  sliderSettingsProp?: any
}

export const EventsSlider = ({ title, items, marketplace, link, children, sliderSettingsProp }: Props) => {
  return (
    <div className="">
      {title && (
        <h2 className='font-bold text-4xl leading-7 py-8'>{title}</h2>
      )}

      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          '@1.50': {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >

        {items && items.map((item: any, index: number) =>
          <SwiperSlide key={index}>
            <EventCard
              date={item.startDate}
              title={item.name}
              place={item.location}
              image={item.image}
              link={link ? `${link}/${item.id}` : marketplace ? `/marketplace/event-tickets/${item.id}` : `/event/${item.id}`}
            />
          </SwiperSlide>
        )}

      </Swiper>
    </div>
  );
}

