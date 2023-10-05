import React, { useState, useMemo, useEffect } from 'react'

import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';

import { EventType, UserData } from '@/types/types'
import { Timezone } from './Timezone';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { Loading } from './Loading';
import { useRouter } from 'next/router';

export default function EditAccount({ address }: any) {
  const [data, setData] = useState<UserData>()
  const [imageUploadPercentage, setImageUploadPercentage] = useState(0)
  const [countryValue, setCountryValue] = useState('')
  const [loading, setLoading] = useState(false)
  const options: any = useMemo(() => countryList().getData(), [])
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', address)
      const docSnap = await getDoc(usersRef)
      return docSnap.data()
    }

    if (address) {
      getUserInfo().then((result: any) => {
        setUserInfo(result)
        setData(result)
      })
    }
  }, [address]);

  const changeHandler = (value: any) => {
    setCountryValue(value)
    setData({ ...data!, country: value.label })
  }

  const onSubmit = async () => {
    setLoading(true)
    const usersRef = doc(db, 'users', address)
    try {
      await setDoc(usersRef, { ...data }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }
    
    setLoading(false)
    router.push('/account')
  }

  console.log('userInfo', userInfo);

  return (
    <div className='w-full max-w-normal m-auto mx-[50px]'>
      <div className='mb-[20px] flex flex-col md:flex-row'>
        <div className='flex flex-col'>
          <label htmlFor='image'>Image</label>
          <input
            type='file'
            id='image'
            onChange={(event) => {
              const image = event?.target?.files ? event.target.files[0] : ''
              if (image) {
                const storageRef = ref(storage, `/${data?.name + uuid()}/${image.name + uuid()}`)
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
                      setData({ ...data!, profilePicture: url })
                    });
                  }
                );
              }

            }}
          />
        </div>

        <div>{imageUploadPercentage > 1 && imageUploadPercentage < 100 ? `Uploading ${imageUploadPercentage}%...` : ''}</div>
        {data?.profilePicture && <img src={data?.profilePicture} className='w-auto h-[220px] object-cover' />}
      </div>
      <div className='mb-[20px]'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.name}
          value={data?.name}
          onChange={(event) =>
            setData({ ...data!, name: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='phone'>Phone Number</label>
        <input
          type='text'
          id='phone'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.phoneNumber}
          value={data?.phoneNumber}
          onChange={(event) =>
            setData({ ...data!, phoneNumber: event.target.value })
          }
        />
      </div>



      <div>

        <h1>Home Address</h1>

        <div className='mb-[20px]'>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            id='address'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder=''
            value={data?.address}
            onChange={(event) =>
              setData({ ...data!, address: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px]'>
          <label htmlFor='city'>City</label>
          <input
            type='text'
            id='city'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder=''
            value={data?.city}
            onChange={(event) =>
              setData({ ...data!, city: event.target.value })
            }
          />
        </div>

        <div className="mb-[20px]">
          <label htmlFor='country'>Country</label>
          <Select
            placeholder={data?.country}
            options={options}
            value={countryValue}
            onChange={changeHandler}
            className="text-black"
          />
        </div>
      </div>

      <div className='flex justify-end mt-[20px]'>
        <button
          onClick={() => loading ? () => { } : onSubmit()}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
          disabled={loading}
        >
          {loading ? <Loading /> : 'Save'}
        </button>
      </div>
    </div>
  )
}
