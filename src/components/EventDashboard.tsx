import { useEffect, useState } from 'react'
import { usePaper } from '@/context/PaperContext'
import { getDocument, db } from "@/firebase/firestore/getData";
import { convertFirestoreDataToObject } from '@/utils/firestore'
import { useContract } from '@thirdweb-dev/react';
import Html5QrcodePlugin from './Html5QrcodePlugin';
import ResultContainerPlugin from './ResultContainerPlugin';
import Modal from './Modal';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import WalletUserInfo from './WalletUserInfo';
import { Card } from './dashboard/Card';
import Link from 'next/link';
import { AiFillEye, AiFillEdit, AiOutlineSetting } from 'react-icons/ai';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { getShortAddress } from '@/lib/utils';
import { TicketHolders } from './TicketHolders';
import { ContractType } from '@/types/types';

interface EventFormProps {
  id?: string
}

export default function EventDashboard({ id }: EventFormProps) {
  const { address } = usePaper();
  const [step, setStep] = useState(1)
  const [tickets, setTickets] = useState<any>([])
  const [eventInfo, setEventInfo] = useState<any>()
  const [attendesList, setAttendesList] = useState<[]>()
  const [tokensUsed, setTokensUsed] = useState<any[]>()
  const [ticketHolders, setTicketHolders] = useState<number>()
  const [totalTickets, setTotalTickets] = useState<number>()
  const [ticketsCategories, setTicketsCategories] = useState<any>()

  useEffect(() => {
    if (!id) return
    const getData = async () => {
      return await getDocument('events', id)
    }
    getData().then((result: any) => {
      const convertedEvent = convertFirestoreDataToObject(result.result._document.data.value.mapValue.fields)
      setEventInfo(convertedEvent)
    })
  }, [id]);

  useEffect(() => {
    async function getAttendes() {
      const eventRef = doc(db, 'events', id ?? '');

      try {
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setAttendesList(eventData.attendees)
          setTokensUsed(eventData.tokensUsed)
        }
      } catch (e) {
        console.error('Error getting attendees:', e);
      }
    }
    getAttendes()
  }, [])

  const getTicketsBought = () => {
    let totalSupply = 0
    ticketsCategories.map((item: any) => {
      totalSupply += Number(item.supply)
      return 0
    })
    return totalSupply
  }

  return (
    <div className='w-full flex bg-gray-700 min-h-[90vh]'>
      <div className='main w-full border-solid border-green-500 border-0 p-[20px] gap-4 flex flex-col '>
        <Card title={eventInfo?.name} description={getShortAddress(eventInfo?.contractAddress)} fullDescription={eventInfo?.contractAddress} />

        <div className='flex'>
          <Link href={`/event/${id}`} className='cursor-pointer drop-shadow-md mr-[10px]'>
            <AiFillEye
              size={30}
            />
          </Link>

          <Link href={`/dashboard/edit-event/${id}`} className='cursor-pointer drop-shadow-md mr-[10px]'>
            <AiFillEdit
              size={30}
            />
          </Link>

          <Link href={`/dashboard/eventInfo/scanner/${id}`} className='cursor-pointer drop-shadow-md mr-[10px]'>
            <MdOutlineQrCodeScanner
              size={30}
            />
            {/* <MdOutlineQrCodeScanner/> */}
          </Link>
        </div>
        <div className='flex md:flex-row flex-col gap-4'>
          {eventInfo?.contractType === ContractType.nftDrop && <Card title="Ticket Holders" description={`${ticketHolders}`} />}
          {eventInfo?.contractType === ContractType.editionDrop && <Card title="Tickets Bought" description={`${getTicketsBought()}`} />}
          {/* <Card title="Attendes" description='100' /> */}
          {/* <Card title="Total Tickets Issued" description={`${totalTickets}`} /> */}
          
          <Card title="Tickets Validated" description={`${attendesList?.length ?? '0'}`} />
        </div>

        <div>
          <h2 className='text-2xl mb-[10px]'>Tickets Categories</h2>
          {ticketsCategories && ticketsCategories.length > 0 && ticketsCategories.map((item: any, index: number) => {
            console.log('item', item);

            return (
              <div key={index} className="mb-[20px]">
                <p>Name:{item.metadata.name}</p>
                <p>Supply:{item.supply}</p>
              </div>
            )
          })}
        </div>

        <TicketHolders
          contractAddress={eventInfo?.contractAddress}
          setTicketHolders={setTicketHolders}
          setTotalTickets={setTotalTickets}
          contractType={eventInfo?.contractType}
          setTicketsCategories={setTicketsCategories}
        />
      </div>
    </div>
  )
}
