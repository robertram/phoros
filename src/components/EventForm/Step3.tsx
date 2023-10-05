import React, { useState } from 'react'
import { sendBroadcastNotification } from '@/utils/sendNotification'
import { useRouter } from 'next/router'
import addData from '@/firebase/firestore/addData'
import Modal from '@/components/Modal'
import { uuid } from 'uuidv4'
import { EventType } from '@/types/types'
import { EventBanner } from '../EventBanner'
import { convertFirestoreDataToObject } from '@/utils/firestore'
import editData from '@/firebase/firestore/editData'
import { Loading } from '../Loading'

interface StepProps {
  id?: string
  action?: string
  onSubmit?: () => void
  onPreviousStep: () => void
  previewData: EventType
  userAddress: string
}

export default function Step3({
  id,
  action,
  previewData,
  onPreviousStep,
  userAddress
}: StepProps) {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const backStep = (event: any) => {
    event.preventDefault()
    onPreviousStep()
  }

  const testDeploy = () => {
    sendBroadcastNotification({ eventName: previewData.name })
  }

  const publishEvent = async () => {
    setLoading(true)
    const activeChain = process.env.NEXT_PUBLIC_CHAIN

    const eventInfo: EventType = {
      ...previewData,
      organizers: previewData?.organizers.length > 0 ? previewData?.organizers : [userAddress],   //[...previewData?.organizers, userAddress],
      timeZone: previewData?.timeZone ? previewData?.timeZone : 'America/Costa_Rica',
      chain: activeChain
    }

    const result = await addEventToFirebase(eventInfo)
    if (result) {
      setShowSuccessModal(true)
    }
    setLoading(false)
    //await sendBroadcastNotification({ eventName: previewData.eventName })
  }

  const addEventToFirebase = async (data: any) => {
    const { result, error } = await addData('events', uuid(), data)
    if (error) {
      setError(`Firebase error: ${error}`)
      return console.log('Add to firebase error', error)
    }
    return { result }
  }

  const editEvent = async () => {
    setLoading(true)

    const eventInfo: EventType = {
      ...previewData,
      organizers: previewData?.organizers.length > 0 ? previewData?.organizers : [userAddress],   //[...previewData?.organizers, userAddress],
      timeZone: previewData?.timeZone ? previewData?.timeZone : 'America/Costa_Rica'
    }

    const result = await editEventInFirebase(eventInfo)
    if (result) {
      setShowSuccessModal(true)
    }
    setLoading(false)
    //await sendBroadcastNotification({ eventName: previewData.eventName })
  }

  const editEventInFirebase = async (data: any) => {
    if (!id) return
    const { result, error } = await editData('events', id, data)
    if (error) {
      setError(`Firebase error: ${error}`)
      return console.log('Add to firebase error', error)
    }
    return { result }
  }

  return (
    <div className='min-h-screen max-w-6xl '>
      <div className='mt-[20px]'>
        <EventBanner eventData={previewData} className="!p-0" />
      </div>

      {error && <p className='text-red-600 font-semibold text-sm'>{error}</p>}

      <div className='flex justify-end'>
        {!showSuccessModal &&
          <button
            onClick={backStep}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
          >
            Back
          </button>
        }

        {action != 'edit' && !loading &&
          <button
            onClick={publishEvent}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 ml-[20px]'
          >
            Publish Event
          </button>
        }

        {action == 'edit' &&
          <button
            disabled={loading}
            onClick={editEvent}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 ml-[20px]'
          >
            {loading ? <Loading /> : 'Edit Event'}
          </button>
        }

      </div>

      <Modal
        show={showSuccessModal}
        setShow={() => {
          setShowSuccessModal(!showSuccessModal)
        }}
      >
        <div className='p-[20px]'>
          {action != 'edit' &&
            <h2 className='font-bold text-2xl leading-7'>
              {`Your event ${previewData.name ? `"${previewData.name}"` : ''} was successfully created`}
            </h2>
          }

          {action == 'edit' &&
            <h2 className='font-bold text-2xl leading-7'>
              {`Your event ${previewData.name ? `"${previewData.name}"` : ''} was successfully edited`}
            </h2>
          }
          <button
            className='mt-[20px] w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple'
            onClick={() => {
              router.push('/account')
            }}
          >
            Ok
          </button>
        </div>
      </Modal>
    </div>
  )
}
