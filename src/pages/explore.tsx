import { getDocuments } from "@/firebase/firestore/getData";
import { useEffect, useState } from 'react';
import { SearchHero } from '@/components/SearchHero';
import { EventsSlider } from '@/components/EventsSlider';
import TicketCard from "@/components/TicketCard";
import type { Metadata } from 'next';
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: 'Example component!',
  description: 'Learning Next.js SEO',
};

export default function Home() {
  const [availableEvents, setAvailableEvents] = useState([]);
  const [oldEvents, setOldEvents] = useState([]);
  //

  useEffect(() => {
    const getAllData = async () => {
      return await getDocuments({ collectionName: 'events' })
    }

    getAllData().then((result: any) => {
      const availableEvents = result.result.filter((item: any) => item.isAvailable === true && item.isPending === false);
      const events = result.result.filter((item: any) => item.isPending === false && item.isAvailable === false);
      setAvailableEvents(availableEvents)
      setOldEvents(events)
    })
  }, []);

  return (
    <Layout title="Explore Events">
      <div className="">
        <div className='px-[20px] max-w-large flex items-center m-auto'>
          <div className="w-full m-auto">
            <SearchHero />
            <EventsSlider title='Incoming Events' items={availableEvents} />
            <EventsSlider title='Old Events' items={oldEvents} />

          </div>
          {/* <EventsSlider title='Past Events' items={pastEvents} /> */}
        </div>
      </div>
    </Layout>
  )
}
