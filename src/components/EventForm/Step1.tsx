import React, { useEffect, useState } from 'react'

import storage from "../../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';

import { EventType } from '@/types/types'
import { Timezone } from '../Timezone';
import { RichTextEditor } from '../RichTextEditor';
import LocationInput from '../LocationInput';
import { AiFillDelete } from 'react-icons/ai';
import Button from '../Button';
import { Toggle } from '../Toggle';

interface StepProps {
  onSubmit: () => void
  setData: (item: any) => void
  data: EventType
}

export default function Step1({ onSubmit, setData, data }: StepProps) {
  const [imageUploadPercentage, setImageUploadPercentage] = useState(0)
  const [organizersList, setOrganizersList] = useState<any[]>(data?.organizers)
  const [newOrganizer, setNewOrganizer] = useState<string>('');

  useEffect(() => {
    if (organizersList?.length == 0) {
      setOrganizersList(data?.organizers)
    }
  }, [data])


  useEffect(() => {
    setData({ ...data, organizers: organizersList })
  }, [organizersList])

  return (
    <div>
      <div className='mb-[20px]'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder='Enter the Event Name'
          value={data.name}
          onChange={(event) =>
            setData({ ...data, name: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='description'>Description</label>
        {/* <textarea
          id='description'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder='Enter a description'
          value={data.description}
          rows={4}
          onChange={(event) =>
            setData({ ...data, description: event.target.value })
          }
        /> */}

        <RichTextEditor value={data.description} onChange={(content) => setData({ ...data, description: content })} />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='category'>Category</label>
        <select
          id='category'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          value={data.category}
          onChange={(event) =>
            setData({ ...data, category: event.target.value })
          }
        >
          <option value=''>Select a category</option>
          <option value='music'>Music</option>
          <option value='crypto'>Crypto</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div className='mb-[20px] flex flex-col md:flex-row'>
        <div className='flex flex-col'>
          <label htmlFor='image'>Image</label>
          <input
            type='file'
            id='image'
            onChange={(event) => {
              const image = event?.target?.files ? event.target.files[0] : ''
              if (image) {
                const storageRef = ref(storage, `/${data.name + uuid()}/${image.name + uuid()}`)
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    const percent = Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setImageUploadPercentage(percent)
                  },
                  (err) => console.log(err),
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                      setData({ ...data, image: url })
                    });
                  }
                );
              }

            }}
          />
        </div>

        {/* <div>{imageUploadPercentage > 1 && imageUploadPercentage < 100 ? `Uploading ${imageUploadPercentage}%...` : ''}</div> */}
        {data.image && <img src={data.image} className='w-auto h-[220px] object-cover' />}
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='location'>Location</label>

        <LocationInput
          onChange={(selection) => {
            setData({
              ...data, location: selection?.address ?? '', lat: selection?.lat.toString() ?? '', lng: selection?.lng.toString() ?? ''
            })
          }}
        />

      </div>

      <div className='mb-[20px] flex flex-col md:flex-row '>
        <div className='w-full md:w-[50%] mr-[10px]'>
          <label htmlFor='startDate'>Start Date</label>
          <input
            required
            type='datetime-local'
            id='startDate'
            value={data.startDate}
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            onChange={(event) => {
              console.log('startDate', event.target.value);

              setData({ ...data, startDate: event.target.value })

            }}
          />
        </div>

        <div className='w-full md:w-[50%] md:ml-[10px]'>
          <label htmlFor='endDate'>End Date</label>
          <input
            type='datetime-local'
            id='endDate'
            value={data.endDate}
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            onChange={(event) =>
              setData({ ...data, endDate: event.target.value })
            }
          />
        </div>
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='timeZone'>Time Zone</label>
        <Timezone value={data.timeZone} onChange={(timezone: any) => setData({ ...data, timeZone: timezone })} />
      </div>

      {/* <div className='mb-[20px] flex flex-col'>
        <label htmlFor='hasFloorplan'>Need a Floorplan?</label>
        <input
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          type='checkbox'
          id='hasFloorplan'
          name='hasFloorplan'
          checked={data.hasFloorplan}
          onChange={(event) =>
            setData({ ...data, hasFloorplan: event.target.checked })
          }
        />
      </div> */}

      <div>
        <h2 className='text-2xl mb-[20px]'>Social Media</h2>

        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-[50%] mr-[10px]'>
            <label htmlFor='website'>Website</label>
            <input
              type='website'
              id='website'
              value={data.website}
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='https://google.com'
              onChange={(event) =>
                setData({ ...data, website: event.target.value })
              }
            />
          </div>

          <div className='w-full md:w-[50%] md:ml-[10px]'>
            <label htmlFor='twitter'>Twitter</label>
            <input
              type='twitter'
              id='twitter'
              value={data.twitter}
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='@checkmyticket'
              onChange={(event) =>
                setData({ ...data, twitter: event.target.value })
              }
            />
          </div>



        </div>




        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-[50%] mr-[10px]'>
            <label htmlFor='discord'>Discord</label>
            <input
              type='discord'
              id='discord'
              value={data.discord}
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='https://discord.gg/checkmyticket'
              onChange={(event) =>
                setData({ ...data, discord: event.target.value })
              }
            />
          </div>

          <div className='w-full md:w-[50%] md:ml-[10px]'>
            <label htmlFor='instagram'>Instagram</label>
            <input
              type='instagram'
              id='instagram'
              value={data.instagram}
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='@checkmyticket'
              onChange={(event) =>
                setData({ ...data, instagram: event.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className='mt-[40px]'>
        <p className='text-2xl mb-[10px]'>Organizers</p>
        <div className='flex md:flex-row flex-col'>
          <input
            type='text'
            id='organizers'
            value={newOrganizer}
            onChange={(event) => setNewOrganizer(event.target.value)}
            className='border border-gray-300 rounded-md p-2 text-black h-min w-full md:w-[70%]'
            placeholder='Organizer Address'
          />

          <Button
            className='my-[10px] md:my-0 md:ml-[10px]'
            secondary
            onClick={() => {
              if (newOrganizer.trim() !== '') {
                setOrganizersList((prevList: any[]) => [...prevList, newOrganizer]);
                setData({ ...data, organizers: organizersList })
                setNewOrganizer('');
              }
            }}
          >
            Add new organizer
          </Button>
        </div>

        {organizersList && organizersList.map((item, index) => {
          return (
            <div className='my-[15px] flex' key={index}>
              <p className='mr-[10px]'>{item}</p>
              <button onClick={() => {
                const updatedList = [...organizersList];
                updatedList.splice(index, 1);
                setOrganizersList(updatedList);
              }}> <AiFillDelete size={30} /> </button>
            </div>
          )
        })}
      </div>

      <div className='mb-[20px] flex flex-col'>
        <div className='flex justify-between'>
          <div>
            <p className='text-2xl'>Is the event Available?</p>
            <p className='text-body'>Can the users reserve?</p>
          </div>
          <div className='my-auto'>
            <Toggle
              name='isAvailable'
              checked={data.isAvailable}
              onChange={(event) => {
                setData({ ...data, isAvailable: event.target.checked })
              }}
            />
          </div>
        </div>
      </div>


      <div className='flex justify-end mt-[20px]'>
        <button
          onClick={() => onSubmit()}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
        >
          Continue
        </button>
      </div>
    </div>
  )
}
