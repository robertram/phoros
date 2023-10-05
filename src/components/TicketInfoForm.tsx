
import { EventType } from '@/types/types'
import { useEffect, useState } from 'react'
import IPFSUpload from './IPFSUpload'
import { Toggle } from './Toggle'

interface TicketsInfoFormProps {
  setData: (item: any) => void
  data: EventType
  id: number
}

export const TicketsInfoForm = ({ setData, data, id }: TicketsInfoFormProps) => {

  // useEffect(() => {
  //   data[ImageName] = imageUrl;
  //   setData({ ...data })
  // }, [imageUrl])

  // useEffect(() => {
  //   data[ImageName] = imageUrl;
  //   setData({ ...data, isPaid: event.target.checked })
  // }, [isTicketPaid])

  const [ticketInfo, setTicketInfo] = useState<any>({})

  useEffect(() => {
    const ticketName = `ticketName${id}`;
    const ticketPrice = `ticketPrice${id}`;
    const ticketSupply = `ticketSupply${id}`;
    const ticketIsPaid = `ticketIsPaid${id}`;

    const tickets: any = {};

    // Add the ticket information to the object
    tickets[ticketName] = ticketInfo.ticketName;
    tickets[ticketSupply] = ticketInfo.ticketSupply;
    tickets[ticketIsPaid] = ticketInfo.isPaid;
    tickets[ticketPrice] = ticketInfo.ticketPrice;
    console.log('data', data);
    setData({ ...data, ...tickets })
  }, [ticketInfo])

  //console.log('ticketInfo', ticketInfo);

  return (
    <div className='border-b-2 border-white border-solid mb-[20px]'>
      <h3 className='text-3xl'>Ticket {id}</h3>
      <div className='mb-[20px]'>
        <label htmlFor={`ticketName`}>Ticket Name</label>
        <input
          type='text'
          id={`ticketName`}
          name={`ticketName`}
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder='Ticket Name'
          //value={data.ticketName}
          value={ticketInfo.ticketName}
          onChange={(event) => {
            setTicketInfo({ ...ticketInfo, [event.target.name]: event.target.value })
            //setData({ ...data, [event.target.name]: event.target.value })
          }}
        />
      </div>

      {/* <div className='mb-[20px] flex'>
        <IPFSUpload text='Ticket Image' setTicketImage={(image) => { setImageUrl(image) }} />
      </div> */}

      <div className='mb-[20px] flex flex-col'>
        <label htmlFor={`ticketSupply${id}`}>Ticket Supply</label>
        <input
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          type='number'
          id={`ticketSupply`}
          name={`ticketSupply`}
          value={ticketInfo.ticketSupply}
          //value={data.ticketSupply}
          onChange={(event) =>
            setTicketInfo({ ...ticketInfo, [event.target.name]: event.target.value })
            //setData({ ...data, [event.target.name]: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px] flex flex-col'>
        <div className='flex justify-between'>
          <div>
            <p className='text-2xl'>Does the ticket has a cost?</p>
            <p className='text-body'>The ticket is free or paid</p>
          </div>
          <div className='my-auto'>
            <Toggle
              name='isPaid'
              //checked={data.isPaid}
              checked={ticketInfo.isPaid}
              onChange={(event) => {
                //setData({ ...data, isPaid: event.target.checked })
                setTicketInfo({ ...ticketInfo, isPaid: event.target.checked })
                //setIsTicketPaid(event.target.checked)
              }}
            />
          </div>
        </div>
      </div>
      {console.log('ticketInfo', ticketInfo)
      }

      {ticketInfo.isPaid &&
        <div className='mb-[20px] flex flex-col'>
          <label htmlFor='ticketPrice'>Ticket Price ($)</label>
          <input
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            type='number'
            id='ticketPrice'
            name='ticketPrice'
            //value={data.ticketPrice}
            value={ticketInfo.ticketPrice}
            //placeholder={'0'}
            onChange={(event) =>
              setTicketInfo({ ...ticketInfo, ticketPrice: event.target.value })
              //setData({ ...data, ticketPrice: event.target.value })
            }
          />
        </div>
      }
    </div>
  )

}
