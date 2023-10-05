import Step1 from '@/components/EventForm/Step1'
import Step2 from '@/components/EventForm/Step2'
import Step3 from '@/components/EventForm/Step3'
import { useEffect, useState } from 'react'
import { ContractType, EventType } from '@/types/types'
import { usePaper } from '@/context/PaperContext'
import { StepsBar } from '@/components/StepsBar'
import EventCard from '@/components/EventCard'
import moment from 'moment'
import { getDocument } from "@/firebase/firestore/getData";
import { convertFirestoreDataToObject } from '@/utils/firestore'
import { checkIsAdmin } from '@/utils/paper'
import Step4 from './EventForm/Step4'

interface EventFormProps {
  id?: string
  action?: string
}

export default function EventForm({ id, action }: EventFormProps) {
  const { address } = usePaper();
  const [step, setStep] = useState(1)
  const [tickets, setTickets] = useState<any>([])
  const [previewData, setPreviewData] = useState<EventType>({
    name: '',
    description: '',
    category: '',
    image: '',
    location: '',
    lat: '',
    lng: '',
    startDate: '',
    endDate: '',
    timeZone: '',
    hasFloorplan: false,
    organizers: [],
    isAvailable: true,
    chain: '',

    audience: '',
    note: '',
    hasNftsMinted: false,

    email: '',
    website: '',
    twitter: '',
    discord: '',
    instagram: '',

    ticketName: '',
    ticketImage: '',
    ticketSupply: '',
    isPaid: false,
    acceptCrypto: false,
    acceptFiat: false,
    currency: '',
    isResellable: false,
    ticketPrice: 0,
    resaleRoyalty: 0,
    isContractVerified: false,
    URI: '',
    contractAddress: '',
    contractType: ContractType.noSet,
    marketplaceAddress: '',
    marketplaceId: '',
    seatsEventName: '',
    seatsWorkspaceKey: '',
    contractId: ''
  })

  useEffect(() => {
    if (!id) return
    const getData = async () => {
      return await getDocument('events', id)
    }
    getData().then((result: any) => {
      const convertedEvent = convertFirestoreDataToObject(result.result._document.data.value.mapValue.fields)
      setPreviewData(convertedEvent)
    })
  }, [id]);

  const stepTitles = ["Event Information", "Tickets Information", "Preview"]
  const adminStepTitles = ["Event Information", "Tickets Information", "Preview", "Contract"]

  console.log('previewData', previewData);


  return (
    <div className='min-h-screen max-w-6xl px-[20px] md:px-[50px] md:mx-auto my-[50px]'>
      <h1 className='text-4xl'>{checkIsAdmin() ? adminStepTitles[step - 1] : stepTitles[step - 1]}</h1>
      <StepsBar currentStep={step} setStep={(step) => { setStep(step) }} steps={checkIsAdmin() ? adminStepTitles : stepTitles} />

      <div>
        {step === 1 && (
          <div className='flex mt-[20px]'>
            <div className='w-full md:w-[70%] md:mr-[50px]'>
              <Step1
                onSubmit={() => setStep(step + 1)}
                setData={setPreviewData}
                data={previewData}
              />
            </div>

            <div className='hidden md:block md:w-[30%]'>
              <EventCard
                title={previewData.name ? previewData.name : "Event title"}
                date={previewData.startDate ? previewData.startDate : moment()}
                place={previewData.location ? previewData.location : 'Houston, Texas'}
                image={previewData?.image ? previewData?.image : 'https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Event%2Fsundown3.jpg33e8312a-ef23-41d8-a65d-f2501a0f177b?alt=media&token=e2d408e2-48bc-465e-a203-19a106d59e93'}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className='flex mt-[20px]'>
            <div className='w-full md:mr-[50px]'>
              <Step2
                onSubmit={() => {
                  setStep(step + 1)
                }}
                onPreviousStep={() => setStep(step - 1)}
                setData={setPreviewData}
                data={previewData}
                tickets={tickets}
                setTickets={setTickets}
              />
            </div>
          </div>
        )}
        {step === 3 && (
          <Step3
            id={id}
            onPreviousStep={() => setStep(step - 1)}
            previewData={previewData}
            userAddress={address}
            action={action}
          />
        )}
        {step === 4 && (
          <div className='flex mt-[20px]'>
            <div className='w-full'>
              <Step4
                id={id}
                onSubmit={() => {
                  setStep(step + 1)
                }}
                userAddress={address}
                onPreviousStep={() => setStep(step - 1)}
                setData={setPreviewData}
                previewData={previewData}
                action={action}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
