import React, { useState } from 'react'
import { ContractType, EventType } from '@/types/types'
import { Toggle } from '../Toggle';
import { Loading } from '../Loading';
import editData from '@/firebase/firestore/editData'
import Modal from '../Modal';
import { useRouter } from 'next/router'

interface StepProps {
  id?: string
  onSubmit: () => void
  action?: string
  setData: (item: any) => void
  previewData: EventType
  onPreviousStep: () => void
  userAddress: string
}

export default function Step4({
  id,
  onSubmit,
  setData,
  action,
  previewData,
  onPreviousStep,
  userAddress
}: StepProps) {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setData({
      marketplaceAddress: ''
    })
  }

  const nextStep = (event: any) => {
    event.preventDefault()
    onSubmit()
  }

  const backStep = (event: any) => {
    event.preventDefault()
    onPreviousStep()
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

  console.log('previewData', previewData);
  

  return (
    <div className='min-h-screen max-w-6xl md:mx-auto'>
      <form onSubmit={handleSubmit} className='text-white'>

        <div className='mb-[20px]'>
          <label htmlFor='name'>Contract Address</label>
          <input
            type='text'
            id='contractAddress'
            name='contractAddress'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Contract Address'
            value={previewData.contractAddress}
            onChange={(event) =>
              setData({ ...previewData, [event.target.name]: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px]'>
          <label htmlFor='contractType'>Contract Type</label>
          <select
            id='contractType'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            value={previewData.contractType}
            onChange={(event) =>
              setData({ ...previewData, contractType: event.target.value })
            }
          >
            <option value={ContractType.noSet}>Select a contract type</option>
            <option value={ContractType.editionDrop}>{ContractType.editionDrop}</option>
            <option value={ContractType.nftDrop}>{ContractType.nftDrop}</option>
          </select>
        </div>

        <div className='mb-[20px]'>
          <label htmlFor='name'>Contract Id</label>
          <input
            type='text'
            id='contractId'
            name='contractId'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Contract Id'
            value={previewData.contractId}
            onChange={(event) =>
              setData({ ...previewData, [event.target.name]: event.target.value })
            }
          />
        </div>


        <div className='mb-[20px]'>
          <label htmlFor='name'>Marketplace Address</label>
          <input
            type='text'
            id='marketplaceAddress'
            name='marketplaceAddress'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Marketplace Address'
            value={previewData.marketplaceAddress}
            onChange={(event) =>
              setData({ ...previewData, [event.target.name]: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px]'>
          <label htmlFor='name'>Marketplace Id</label>
          <input
            type='text'
            id='marketplaceId'
            name='marketplaceId'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Marketplace Id'
            value={previewData.marketplaceId}
            onChange={(event) =>
              setData({ ...previewData, [event.target.name]: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Is the Event Pending to be configured?</p>
              {/* <p className='text-body'>The users can resell their event tickets</p> */}
            </div>
            <div className='my-auto'>
              <Toggle
                name='isPending'
                checked={previewData.isPending}
                onChange={(event) => {
                  setData({ ...previewData, isPending: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Show Marketplace</p>
              {/* <p className='text-body'>The users can resell their event tickets</p> */}
            </div>
            <div className='my-auto'>
              <Toggle
                name='isPending'
                checked={previewData.hasNftsMinted}
                onChange={(event) => {
                  setData({ ...previewData, hasNftsMinted: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            onClick={backStep}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
          >
            Back
          </button>

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


      </form>

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
