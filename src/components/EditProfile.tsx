import React, { useState, useEffect } from 'react'
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { UserData } from '@/types/types'
import { Loading } from './Loading';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import Edit from '@/icons/Edit';
import Button from './Button';

export const EditProfile = ({ address }: any) => {
  const [data, setData] = useState<UserData>()
  const [imageUploadPercentage, setImageUploadPercentage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', address)
      const docSnap = await getDoc(usersRef)
      return { ...docSnap.data(), id: docSnap.id };
    }

    if (address) {
      getUserInfo().then((result: any) => {
        setUserInfo(result)
        setData(result)
      })
    }
  }, [address]);

  const onSubmit = async () => {
    setLoading(true)
    const usersRef = doc(db, 'users', address)
    try {
      await setDoc(usersRef, { ...data }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }

    setLoading(false)
    router.push('/profile')
  }

  return (
    <div className='mb-[10px]'>
      <div className="w-48 h-48 relative m-auto">
        <input type="file" id="image" accept="image/*" className="hidden z-50"
          onChange={(event) => {
            const image = event?.target?.files ? event.target.files[0] : ''
            if (image) {
              const storageRef = ref(storage, `/${uuid()}/${image.name + uuid()}`)
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
        <label htmlFor="image"
          className="w-full h-full bg-gray-200 rounded-full cursor-pointer overflow-hidden border-4 border-gray-300 flex items-center justify-center">
          <img src={data?.profilePicture} className='w-auto object-cover' />
          <div className='text-white absolute inset-0 flex justify-center items-center'>
            <Edit className="" color="white" />
          </div>
        </label>
        <div id="imagePreview" className="w-full h-full rounded-full bg-cover bg-center absolute top-0 left-0 hidden">
          {data?.profilePicture &&
            <img src={data?.profilePicture} className='w-auto h-[220px] object-cover' />
          }
        </div>
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='bio'>Bio</label>
        <textarea
          id='bio'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.bio}
          value={data?.bio}
          onChange={(event) =>
            setData({ ...data!, bio: event.target.value })
          }>
        </textarea>
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='twitter'>X (Twitter)</label>
        <input
          type='text'
          id='twitter'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.twitter ?? 'https://twitter.com/yourusername'}
          value={data?.twitter}
          onChange={(event) =>
            setData({ ...data!, twitter: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='linkedin'>Linkedin</label>
        <input
          type='text'
          id='linkedin'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.linkedin ?? 'https://www.linkedin.com/yourname'}
          value={data?.linkedin}
          onChange={(event) =>
            setData({ ...data!, linkedin: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='discord'>Discord</label>
        <input
          type='text'
          id='discord'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.discord ?? '@yourusername'}
          value={data?.discord}
          onChange={(event) =>
            setData({ ...data!, discord: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='instagram'>Instagram</label>
        <input
          type='text'
          id='instagram'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.instagram ?? 'https://www.instagram.com/yourhandle'}
          value={data?.instagram}
          onChange={(event) =>
            setData({ ...data!, instagram: event.target.value })
          }
        />
      </div>

      <div className='mb-[20px]'>
        <label htmlFor='telegram'>Telegram</label>
        <input
          type='text'
          id='telegram'
          className='border border-gray-300 rounded-md p-2 w-full text-black'
          placeholder={userInfo?.telegram ?? 'https://t.me/username'}
          value={data?.telegram}
          onChange={(event) =>
            setData({ ...data!, telegram: event.target.value })
          }
        />
      </div>

      <div className='flex justify-end mt-[20px]'>
        <Button
          onClick={() => loading ? () => { } : onSubmit()}
          className="bg-primary"
        >
          {loading ? <Loading /> : 'Confirm'}
        </Button>
      </div>
    </div>
  )
}
