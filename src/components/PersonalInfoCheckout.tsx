import React, { useState, useMemo, useEffect } from 'react'
import { UserData } from '@/types/types'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { Toggle } from './Toggle';
import { useForm, SubmitHandler } from "react-hook-form"
import Button from './Button';
import { usePaper } from '@/context/PaperContext';

interface PersonalInfoCheckoutProps {
  address: string
  onChange: (data: UserData | undefined) => void
  saveUserInfo?: boolean
  setSaveUserInfo?: (saveInfo: boolean) => void
  setStep?: (step: number) => void
}

type Inputs = {
  name: string
  phoneNumber: string
  address: string
  city: string
}

export const PersonalInfoCheckout = ({ address, onChange, saveUserInfo, setSaveUserInfo, setStep }: PersonalInfoCheckoutProps) => {
  const { email } = usePaper();
  const [data, setData] = useState<UserData>()
  const [countryValue, setCountryValue] = useState('')
  const options: any = useMemo(() => countryList().getData(), [])
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    setStep && setStep(1)
    //data.preventDefault();
  }

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


  useEffect(() => {
    setData(userInfo)
  }, [userInfo])

  const changeHandler = (value: any) => {
    console.log('value', value);

    setCountryValue(value)
    setData({ ...data!, country: value.label })
  }

  useEffect(() => {
    onChange(data ?? undefined)
  }, [data])

  useEffect(() => {
    // setData({
    //   ...data!,
    //   name: userInfo?.name ?? '',
    //   phoneNumber: userInfo?.phoneNumber ?? '',
    //   address: userInfo?.address ?? '',
    //   city: userInfo?.city ?? '',
    //   country: userInfo?.country ?? '',
    // })
    setValue('name', userInfo?.name ?? '');
    setValue('phoneNumber', userInfo?.phoneNumber ?? '');
    setValue('address', userInfo?.address ?? '');
    setValue('city', userInfo?.city ?? '');
  }, [userInfo])

  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-[20px]'>
        <label htmlFor='name'>Email*</label>
        <input
          type='text'
          id='email'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={email}
          disabled
        />
      </div>
      <div className='mb-[20px]'>
        <label htmlFor='name'>Name*</label>
        <input
          {...register("name", { required: true })}
          type='text'
          id='name'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.name}
          value={userInfo?.name}
          onChange={(event) =>
            setData({ ...data!, name: event.target.value })
          }
        />
        {errors.name && <span className='text-red-500'>This field is required</span>}
      </div>
      <div className='mb-[20px]'>
        <label htmlFor='phone'>Phone Number*</label>
        <input
          {...register("phoneNumber", { required: true })}
          type='text'
          id='phoneNumber'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.phoneNumber}
          value={data?.phoneNumber}
          onChange={(event) =>
            setData({ ...data!, phoneNumber: event.target.value })
          }
        />
        {errors.phoneNumber && <span className='text-red-500'>This field is required</span>}
      </div>

      <div>
        <h3 className='text-xl'>Home Address</h3>
        <div className='mb-[20px]'>
          <label htmlFor='address'>Address*</label>
          <input
            {...register("address", { required: true })}
            type='text'
            id='address'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder=''
            value={data?.address}
            onChange={(event) =>
              setData({ ...data!, address: event.target.value })
            }
          />
          {errors.address && <span className='text-red-500'>This field is required</span>}
        </div>

        <div className='mb-[20px]'>
          <label htmlFor='city'>City*</label>
          <input
            {...register("city", { required: true })}
            type='text'
            id='city'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder=''
            value={data?.city}
            onChange={(event) =>
              setData({ ...data!, city: event.target.value })
            }
          />
          {errors.city && <span className='text-red-500'>This field is required</span>}
        </div>

        <div className="mb-[20px]">
          <label htmlFor='country'>Country*</label>
          <Select
            placeholder={data?.country}
            options={options}
            value={countryValue ? countryValue : {
              label: "Costa Rica", value: "CR"
            }}
            onChange={changeHandler}
            className="text-black"
            required
          />
        </div>
      </div>

      <div className='mb-[20px] flex flex-col'>
        <div className='flex justify-between'>
          <div>
            <p className='text-xl'>Do you want to save this information for the next purchases?</p>
            {/* <p className='text-body'>Can the users reserve?</p> */}
          </div>
          <div className='my-auto'>
            <Toggle
              name='saveUserInfo'
              checked={saveUserInfo ?? false}
              onChange={(event) => {
                setSaveUserInfo && setSaveUserInfo(event.target.checked)
              }}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button className='w-min'>
          <input type="submit" />
        </Button>
        {/* <button
          onClick={() => {
            setStep && setStep(1)
          }}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 ml-[20px]'
        >
          Continue
        </button> */}
      </div>
    </form>
  )
}
