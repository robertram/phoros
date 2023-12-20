
import { useRouter } from 'next/router';
import Image from 'next/image'
import { getDocument } from "@/firebase/firestore/getData";
import { useEffect, useState } from 'react';
import Calendar from '@/icons/Calendar';
import MapPin from '@/icons/MapPin';
//import { usePaper } from '@/context/PaperContext';
import Modal from '@/components/Modal';
import moment from 'moment';
import ProhibitedPageAccess from '@/components/ProhibitedPageAccess';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { EventType, UserData } from '@/types/types'
import { useAuth } from '@/context/AuthContext';
import { PaidNFTPicker } from '@/components/PaidNFTPicker';
import { query, collection, where } from "firebase/firestore";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { PlanPicker } from './PlanPicker';
import { SelectedPlan } from './SelectedPlan';
// import CardCheckout from '@/components/CardCheckout';
// import CryptoCheckout from '@/components/CryptoCheckout';

export const Checkout = () => {
  const { address } = useAuth();
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [eventData, setEventData] = useState<EventType | undefined | any>(undefined);
  const [chosedNFT, setChosedNFT] = useState(0)
  const [activeTab, setActiveTab] = useState(0);
  const [paymentSuccesful, setPaymentSuccesful] = useState(false);
  const [userData, setUserData] = useState<UserData>()
  const [saveUserInfo, setSaveUserInfo] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(0);

  useEffect(() => {
    updateBuyersToEvent(address ?? '')
    if (paymentSuccesful && saveUserInfo) {
      updateUserInfo()
    }
  }, [paymentSuccesful])

  const updateBuyersToEvent = async (buyerAddress: string) => {
    const eventRef = doc(db, 'events', id ?? '');

    try {
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();

        // // Ensure that the 'buyers' field exists in the event data
        if (!eventData.buyers) {
          eventData.buyers = [];
        }

        if (!eventData.buyers.includes(buyerAddress)) {
          // Add the new attendee email to the 'buyers' array
          eventData.buyers.push(buyerAddress);

          // Update the event document with the new attendee
          await setDoc(eventRef, eventData, { merge: true });

          console.log('Buyer added successfully.');
        } else {
          console.log('Wallet address is already in the buyers list.');
        }
      } else {
        console.error('Event does not exist.');
      }
    } catch (err) {
      console.error('Error updating buyers:', err);
    }
  }

  const updateUserInfo = async () => {
    const usersRef = doc(db, 'users', address ?? '')
    try {
      await setDoc(usersRef, { ...userData }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }
  }

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      setPaymentSuccesful(true);
    }, 3000);
  }

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "plans"));
      return await getDocuments({ customQuery })
    }

    getAllData().then((result: any) => {
      setPlans(result.result)
    })
  }, []);

  const tabsList = ["Buy with Debit/Credit Card"]
  //, "Buy with Crypto"

  const ticketPrice: any = `ticketPrice${Number(chosedNFT) + 1}`;
  const chosedNFTPrice = eventData && eventData[ticketPrice]?.stringValue

  return (
    <div className='max-w-6xl px-[20px] md:px-[50px] md:mx-auto'>
      {/* <div className="flex flex-col md:flex-row">
        <div className="imageContainer p-[20px] md:p-[30px] bg-custom-pink rounded-md md:mb-[50px] mb-[20px]" >
          <div className="relative h-full w-full min-h-min ">
            <Image
              fill
              className="object-contain !relative"
              src={eventData?.image?.stringValue ? eventData?.image?.stringValue : 'https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Event%2Fsundown3.jpg33e8312a-ef23-41d8-a65d-f2501a0f177b?alt=media&token=e2d408e2-48bc-465e-a203-19a106d59e93'}
              alt={'Banner Image'}
            />
          </div>
        </div>
        <div className="md:max-w-[500px] md:mb-0 mb-[20px] md:p-[40px] w-full 2xl:w-[50%]">
          {eventData?.name && <div className="title text-4xl mb-[10px]">{eventData?.name?.stringValue}</div>}
          {eventData?.location && <div className="location flex">
            <MapPin className="w-5 mr-2 " /> {eventData?.location?.stringValue}
          </div>}
          {eventData?.startDate && <div className="date flex">
            <Calendar className="w-5 mr-2 " /> {moment(eventData?.startDate?.stringValue).format('MMMM Do YYYY h:mm A')}
          </div>}
        </div>
      </div> */}

      <ProhibitedPageAccess checkLoggedIn>
        <div>
          <h2 className='text-2xl mb-[10px]'>Select Plan</h2>

          <PlanPicker
            plans={plans}
            onClick={(index) => {
              setSelectedPlan(index)
            }}
            selectedPlan={selectedPlan}
          />

          <SelectedPlan link={plans[selectedPlan]?.link} />

          {/* <PaidNFTPicker onClick={(tokenId) => setChosedNFT(tokenId)} chosedNFT={chosedNFT} freeEvent={!eventData?.isPaid.booleanValue} onSuccess={handlePaymentSuccess} /> */}

          {address &&
            <div>
              {/* <Tabs
              tabs={tabsList}
              activeTab={activeTab}
              setActiveTab={(tabIndex: number) => {
                setActiveTab(tabIndex)
              }}
            /> */}

              {/* {chosedNFTPrice != 0 && activeTab === 0 &&
                  <div className='mt-[10px]'>
                    <CardCheckout
                      contractAddress={eventData?.contractAddress.stringValue}
                      tokenId={chosedNFT}
                      onSuccess={handlePaymentSuccess}
                      contractType={eventData?.contractType.stringValue}
                      contractId={eventData?.contractId.stringValue}
                      eventData={eventData}
                    />
                  </div>
                }

                {chosedNFTPrice == 0 &&
                  <div>
                    <CryptoCheckout
                      contractAddress={eventData?.contractAddress.stringValue}
                      tokenId={chosedNFT}
                      onSuccess={handlePaymentSuccess}
                      contractType={eventData?.contractType.stringValue}
                    />
                  </div>
                } */}
            </div>
          }
        </div>
      </ProhibitedPageAccess>
      <Modal
        show={paymentSuccesful}
      >
        <div className='p-[20px]'>
          <h2 className='font-bold text-2xl leading-7'>
            Successfully bought the plan {eventData?.name.stringValue}!
          </h2>

          <p className='text-base mt-[10px]'>Your plan will display in your account in less than 1 minute</p>
          <button
            className='mt-[20px] w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple'
          // onClick={() => {
          //   router.push(
          //     `/account`
          //   )
          // }}
          >
            Go to your account
          </button>
        </div>
      </Modal>
    </div>
  );
}
