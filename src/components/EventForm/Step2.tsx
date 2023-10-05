import React, { useState } from 'react'
import { EventType } from '@/types/types'

import storage from "../../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import IPFSUpload from '../IPFSUpload';
import { Toggle } from '../Toggle';

interface StepProps {
  onSubmit: () => void
  setData: (item: any) => void
  data: EventType
  tickets: any
  setTickets: (item: any) => void
  onPreviousStep: () => void
}

export default function Step2({
  onSubmit,
  setData,
  data,
  tickets,
  setTickets,
  onPreviousStep
}: StepProps) {
  const handleSubmit = (event: any) => {
    event.preventDefault()
    setTickets([data])
    setData({
      ticketName: '',
      ticketImage: null,
      ticketSupply: '',
      isPaid: false,
      acceptCrypto: false,
      acceptFiat: false,
      currency: '',
      isResellable: false,
      ticketPrice: '',
      resaleRoyalty: null
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

  return (
    <div className='min-h-screen max-w-6xl md:mx-auto'>
      <form onSubmit={handleSubmit} className='text-white'>
        <div className='mb-[20px]'>
          <label htmlFor='name'>Ticket Name</label>
          <input
            type='text'
            id='ticketName'
            name='ticketName'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Ticket Name'
            value={data.ticketName}
            onChange={(event) =>
              setData({ ...data, [event.target.name]: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px] flex'>
          <IPFSUpload text='Ticket Image' setTicketImage={(imageUrl) => { setData({ ...data, ticketImage: imageUrl }) }} />
        </div>

        <div className='mb-[20px] flex flex-col'>
          <label htmlFor='ticketSupply'>Ticket Supply</label>
          <input
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            type='number'
            id='ticketSupply'
            name='ticketSupply'
            value={data.ticketSupply}
            onChange={(event) =>
              setData({ ...data, ticketSupply: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Does the event has a cost?</p>
              <p className='text-body'>The event is free or paid</p>
            </div>
            <div className='my-auto'>
              <Toggle
                name='isPaid'
                checked={data.isPaid}
                onChange={(event) => {
                  setData({ ...data, isPaid: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>

        {/* <div className='mb-[20px] flex flex-col'>
          <label htmlFor='paymentMethod'>Payment Method</label>
          <div>
            <label>
              <input
                className='border border-gray-300 rounded-md p-2 w-full text-black'
                type='checkbox'
                name='paymentMethod'
                value='creditCard'
                checked={data.acceptFiat}
                onChange={(event) =>
                  setData({ ...data, acceptFiat: event.target.checked })
                }
              />
              Credit Card
            </label>
            <label>
              <input
                className='border border-gray-300 rounded-md p-2 w-full text-black'
                type='checkbox'
                name='paymentMethod'
                value='crypto'
                checked={data.acceptCrypto}
                onChange={(event) =>
                  setData({ ...data, acceptCrypto: event.target.checked })
                }
              />
              Crypto
            </label>
          </div>
        </div> */}

        {/* <div className='mb-[20px] flex flex-col'>
          <label htmlFor='currency'>Currency</label>
          <select
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            id='currency'
            name='currency'
            value={data.currency}
            onChange={(event) =>
              setData({ ...data, currency: event.target.value })
            }
          >
            <option value=''>Select Currency</option>
            <option value='USD'>USD</option>
            <option value='EUR'>EUR</option>
          </select>
        </div> */}

        {data.isPaid &&
          <div className='mb-[20px] flex flex-col'>
            <label htmlFor='ticketPrice'>Ticket Price ($)</label>
            <input
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              type='number'
              id='ticketPrice'
              name='ticketPrice'
              value={data.ticketPrice}
              //placeholder={'0'}
              onChange={(event) =>
                setData({ ...data, ticketPrice: event.target.value })
              }
            />
          </div>
        }

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Is Resellable?</p>
              <p className='text-body'>The users can resell their event tickets</p>
            </div>
            <div className='my-auto'>
              <Toggle
                name='isResellable'
                checked={data.isResellable}
                onChange={(event) => {
                  setData({ ...data, isResellable: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>

        {data.isResellable &&
          <div className='mb-[20px] flex flex-col'>
            <label htmlFor='resaleRoyalty'>Resale Royalty</label>
            <input
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              type='number'
              id='resaleRoyalty'
              name='resaleRoyalty'
              value={data.resaleRoyalty}
              onChange={(event) =>
                setData({ ...data, resaleRoyalty: Number(event.target.value) })
              }
            />
          </div>
        }

        {/* <div>
          <h2>Submitted Forms:</h2>
          {tickets.map((form: any, index: number) => {
            console.log('form', form)
            return (
              <div key={index} className='border-2 border-red-400 border-solid'>
                <p>Name: {form.name}</p>
                <p>Currency: {form.currency}</p>
              </div>
            )
          })}
        </div> */}
        {/* <button
          type='submit'
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
        >
          Add Ticket
        </button> */}

        <div className='flex justify-end'>

          <button
            onClick={backStep}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
          >
            Back
          </button>

          <button
            onClick={nextStep}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 ml-[20px]'
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
