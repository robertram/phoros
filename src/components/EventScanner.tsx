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

interface EventFormProps {
  id?: string
}

export default function EventScanner({ id }: EventFormProps) {
  const { address } = usePaper();
  const [step, setStep] = useState(1)
  const [tickets, setTickets] = useState<any>([])
  const [eventInfo, setEventInfo] = useState<any>()
  const [attendesList, setAttendesList] = useState<[]>()
  const [tokensUsed, setTokensUsed] = useState<any[]>()

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

  //const { contract: editionDrop } = useContract(eventInfo?.contractAddress);
  // useEffect(() => {
  //   // declare the data fetching function
  //   const getNFTsInfo = async () => {
  //     //const nfts = await editionDrop?.erc1155.getAll();
  //     const allRoles = await editionDrop?.roles.getAll();
  //   }

  //   // call the function
  //   getNFTsInfo()
  //     // make sure to catch any error
  //     .catch(console.error);
  // }, [editionDrop])

  enum ValidTicketStatus {
    pending = "pending",
    valid = "valid",
    notValid = "notValid"
  }

  const [decodedResults, setDecodedResults] = useState<any>([]);
  const [validTicket, setValidTicket] = useState<ValidTicketStatus>(ValidTicketStatus.pending);
  const [validTicketUserAddress, setValidTicketUserAddress] = useState<string>('');

  const onNewScanResult = (decodedText: any, decodedResult: any) => {
    console.log("App [result]", decodedResult);
    setDecodedResults((prev: any) => [...prev, decodedResult]);
  };

  function filterResults(results: any) {
    const filteredResults = [];
    for (var i = 0; i < results.length; ++i) {
      if (i === 0) {
        filteredResults.push(results[i]);
        continue;
      }

      if (results[i].decodedText !== results[i - 1].decodedText) {
        filteredResults.push(results[i]);
      }
    }
    return filteredResults;
  }

  const results = filterResults(decodedResults);

  useEffect(() => {
    if (results.length > 0) {
      const splittedResult = results[0].decodedText.split('-')
      const contractAddress = splittedResult[0]
      const tokenId: number = splittedResult[1]
      const userAddress = splittedResult[2]

      if (contractAddress == eventInfo?.contractAddress) {
        if (!tokensUsed?.includes(tokenId)) {
          setValidTicket(ValidTicketStatus.valid)
          updateAttendesToEvent(userAddress)
          updateUsedTicketsToEvent(tokenId)
          setValidTicketUserAddress(userAddress)
        } else {
          setValidTicket(ValidTicketStatus.notValid)
        }
      }
    }
  }, [results])

  const updateAttendesToEvent = async (attendeeAddress: string) => {
    const eventRef = doc(db, 'events', id ?? '');

    try {
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();

        // // Ensure that the 'attendees' field exists in the event data
        if (!eventData.attendees) {
          eventData.attendees = [];
        }

        setAttendesList(eventData.attendees)

        if (!eventData.attendees.includes(attendeeAddress)) {
          // Add the new attendee email to the 'attendees' array
          eventData.attendees.push(attendeeAddress);

          // Update the event document with the new attendee
          await setDoc(eventRef, eventData, { merge: true });

          console.log('Attendee added successfully.');
        } else {
          console.log('Email address is already in the attendees list.');
        }
      } else {
        console.error('Event does not exist.');
      }
    } catch (err) {
      console.error('Error updating attendees:', err);
    }
  }

  const updateUsedTicketsToEvent = async (tokenId: number) => {
    const eventRef = doc(db, 'events', id ?? '');

    try {
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();

        // // Ensure that the 'attendees' field exists in the event data
        if (!eventData.tokensUsed) {
          eventData.tokensUsed = [];
        }

        setAttendesList(eventData.tokensUsed)

        if (!eventData.tokensUsed.includes(tokenId)) {
          eventData.tokensUsed.push(tokenId);

          // Update the event document with the new tokenId
          await setDoc(eventRef, eventData, { merge: true });

          console.log('Token used added successfully.');
        } else {
          console.log('Token Id is already in the token used list.');
        }
      } else {
        console.error('Event does not exist.');
      }
    } catch (err) {
      console.error('Error updating attendees:', err);
    }
  }

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

  return (
    <div className='min-h-screen max-w-6xl px-[20px] md:px-[50px] md:mx-auto my-[50px]'>
      <h1 className='text-4xl'>{eventInfo?.name}</h1>
      <div className='mt-[10px]'>
        {/* <h2 className=''>Assistants</h2> */}
        <div>
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
        </div>

        <div className='mt-[250px]'>
          <h2 className='text-3xl'>Attendes List</h2>

          {attendesList && attendesList.map((attende: any, index: number) => {
            return (
              <div key={index}>
                <WalletUserInfo address={attende} />
              </div>
            )
          })}
        </div>

        <Modal
          show={validTicket !== ValidTicketStatus.pending}
          onClose={() => {
            setValidTicket(ValidTicketStatus.pending)
            setDecodedResults([])
            setValidTicketUserAddress('')
          }}
          height="500px"
        >
          <div className=' mt-[50px]  justify-center align-center p-[10px]'>
            {validTicket === ValidTicketStatus.notValid &&
              <div>
                <h2 className='text-3xl text-center'>Ticket NOT Valid</h2>
                <img src="/notValid.png" className='w-[100px] h-[100px] m-auto mt-[20px]'></img>
                <p className='text-center mt-[10px]'>Ticket already used</p>
              </div>
            }
            {validTicket === ValidTicketStatus.valid &&
              <div>
                <h2 className='text-3xl text-center'>Valid Ticket</h2>
                <img src="/check.png" className='w-[100px] h-[100px] m-auto mt-[20px]'></img>
              </div>
            }
            {validTicketUserAddress &&
              <div className='mt-[20px]'>
                <WalletUserInfo address={validTicketUserAddress ?? ''} />
              </div>
            }
          </div>
        </Modal>

      </div>
    </div>
  )
}
