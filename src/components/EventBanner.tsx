import { EventType } from "@/types/types"
import Calendar from '@/icons/Calendar';
import MapPin from '@/icons/MapPin';
import Clock from '@/icons/Clock';
import { useRouter } from 'next/router';
import EventDetailsItem from '@/components/EventDetailsItem';
import People from '@/icons/People';
import Attention from '@/icons/Attention';
import Image from 'next/image'
import moment from "moment";
import { Markdown } from "./Markdown";
import Map from "./Map";
import { getFormattedLocation } from "@/utils/utils";

interface EventBannerProps {
  eventData: EventType
  id?: string
  className?: string
}

export const EventBanner = ({ eventData, id, className }: EventBannerProps) => {
  const router = useRouter();

  const getDuration = () => {
    var start = moment(eventData.startDate); //todays date
    var end = moment(eventData.endDate); // another date
    var duration = moment.duration(start.diff(end));
    var hoursDuration = duration.asHours();
    return `${-(hoursDuration)} hours`
  }

  const getSchedule = () => {
    var start = moment(eventData.startDate).format('h:mm A');
    var end = moment(eventData.endDate).format('h:mm A');

    return `${start} to ${end}`
  }
  console.log('eventData', eventData)

  return (
    <div className={`max-w-6xl px-[20px] md:px-[50px] md:mx-auto ${className}`}>
      <div className="imageContainer p-[30px] bg-custom-pink rounded-md md:mb-[50px] mb-[30px]" >
        <div className="relative h-full w-full min-h-[300px] md:min-h-[500px]">
          <Image
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            src={eventData?.image ? eventData?.image : 'https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Event%2Fsundown3.jpg33e8312a-ef23-41d8-a65d-f2501a0f177b?alt=media&token=e2d408e2-48bc-465e-a203-19a106d59e93'}
            alt={'Banner Image'}
          />
        </div>
      </div>

      <div className="flex justify-between md:flex-row flex-col">
        <div className=" w-full md:max-w-[500px] md:mb-0 mb-[20px]">
          {eventData?.name && <div className="title text-4xl mb-[10px]">{eventData?.name}</div>}
          {eventData?.location &&
            <div className="location flex">
              <MapPin className="w-5 mr-2 " /> {getFormattedLocation(eventData?.location)}
            </div>
          }
          {eventData?.startDate &&
            <div className="date flex">
              <Calendar className="w-5 mr-2 " /> {moment(eventData?.startDate).format('MMMM Do YYYY h:mm A')}
            </div>
          }
        </div>

        {eventData?.isAvailable ? <div className="buy-container rounded-md border-2 border-solid h-min md:max-w-[300px] w-full text-center items-center">
          <div className="p-6">
            {/* <p>Tickets starting at</p> */}
            {/* {eventData?.ticketPrice && <p>$ {eventData?.ticketPrice}</p>} */}
            {(id) &&
              <button
                className='w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple'
                onClick={() => {
                  router.push(`/event/${id}/checkout`)
                }}
              >
                {!eventData?.isPaid ? 'Get Tickets' : 'Buy Tickets'}
              </button>
            }
          </div>
        </div> :
          <div className="buy-container rounded-md border-2 border-solid h-min md:max-w-[300px] w-full text-center items-center">
            <div className="p-6">
              <p className="text-2xl">Can't get tickets for this event</p>
            </div>
          </div>

        }
      </div>

      <div className="mt-[50px]">
        {eventData?.description &&
          <div className="description mb-[30px]">
            <h3 className="text-2xl mb-[5px]">Description</h3>
            {/* {eventData?.description && <p className="text-md">{eventData?.description}</p>} */}
            {/* {eventData?.description && <div dangerouslySetInnerHTML={{ __html: eventData?.description }}></div>} */}
            {eventData?.description && <Markdown text={eventData?.description} />}
          </div>
        }

        {eventData.lat && eventData.lng &&
          <div>
            <p className="text-2xl mb-[10px]">Map</p>

            <button
              className="w-full h-full"
              onClick={() => {
                window.open("https://maps.google.com?q=" + eventData.lat + "," + eventData.lng);
              }}
            >
              <Map lat={eventData.lat} lng={eventData.lng} />
            </button>
          </div>
        }

        {/* {!eventData?.startDate && !eventData?.audience && !eventData?.note ? '' :
          <div className='mt-[30px]'>
            <div className="text-2xl mb-[20px]">Event Information</div>
            <div className="flex justify-between md:flex-row flex-col mb-[50px]">
              {eventData?.startDate && eventData?.endDate && <EventDetailsItem className="mb-[20px] md:mb-0" icon={<Clock className="w-10 mr-2 mt-1 my-auto" />} title="Duration" schedule={getSchedule()} duration={getDuration()} />}
              {eventData?.audience && <EventDetailsItem className="mb-[20px] md:mb-0" icon={<People className="md:w-20 w-10 mr-2 mt-1 my-auto" />} title="Audience" description={eventData?.audience} />}
              {eventData?.note && <EventDetailsItem className="mb-[20px] md:mb-0" icon={<Attention className="md:w-20 w-10 mr-2 mt-1 my-auto" />} title="Attention" description={eventData?.note} />}
            </div>
          </div>
        } */}
      </div>
    </div >

  )
}