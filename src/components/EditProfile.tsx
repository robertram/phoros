import React, { useState, useEffect } from 'react'
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { UserData } from '@/types/types'
import { Loading } from './Loading';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Edit from '@/icons/Edit';
import Button from './Button';
import { TokenGatedLinks } from './TokenGatedLinks';
import { query, collection, where } from "firebase/firestore";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { removeAtSymbol } from '@/utils/utils';

export const EditProfile = ({ address }: any) => {
  const [data, setData] = useState<UserData>()
  const [imageUploadPercentage, setImageUploadPercentage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const [usernameError, setUsernameError] = useState('');
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
    if (data?.username) {
      const usernameExists = await checkUsernameExists()
      if (usernameExists) {
        return;
      }
    }
    let instagram = ""
    let twitter = ""
    if (data?.instagram || data?.twitter) {
      instagram = removeAtSymbol(data?.instagram ?? '')
      twitter = removeAtSymbol(data?.twitter ?? '')
    }
    setLoading(true)
    const usersRef = doc(db, 'users', address)
    try {

      await setDoc(usersRef, { ...data, instagram, twitter }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }

    setLoading(false)
    router.push(`/u/${data?.username
      ? data?.username
      : (data?.ens
        ? data?.ens
        : data?.id)}`)
  }

  const getAllData = async () => {
    const customQuery = query(collection(db, "users"), where("id", "==", data?.id));
    return await getDocuments({ customQuery })
  }

  const isUsernameValid = (username: string) => {
    // This regex allows letters, numbers, underscores, and hyphens 
    const validUsernameRegex = /^[A-Za-z0-9_-]+$/;
    return validUsernameRegex.test(username) && username.length >= 6 && username.length <= 20;
  }

  const checkUsernameExists = async () => {
    return getAllData().then((result: any) => {
      console.log('result', result.result);
      if (!isUsernameValid(data?.username ?? '')) {
        setUsernameError('The username is invalid. Please follow the rules');
        return true
      }
      else if (result.result.length > 0 && userInfo?.username != data?.username) {
        console.log('Username is already taken. Please choose a different one.');
        setUsernameError('Username is already taken. Please choose a different one.');
        return true
      } else {
        setUsernameError('')
        return false
      }
    })
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
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          className={`border border-gray-border p-2 w-full text-black rounded-[50px]`}
          placeholder={userInfo?.username ?? 'Insert a username'}
          value={data?.username}
          onChange={(event) => {
            setData({ ...data!, username: event.target.value })
          }}
        />
        <div className='mt-[5px]'>
          <p className='text-base text-red-400'>{usernameError}</p>
          <p><b>Special Characters:</b> Only underscores and hyphens are not allowed.</p>
          <p><b>Length:</b> Must be between 6 to 20 characters long.</p>
          <p><b>No Spaces:</b> Usernames should not contain any spaces.</p>
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

      <TokenGatedLinks setData={setData} data={data} />

      <div className='flex justify-end mt-[20px]'>
        <Button
          onClick={() => loading ? () => { } : onSubmit()}
          className="bg-primary flex justify-center"
        >
          {loading ? <Loading /> : 'Confirm'}
        </Button>
      </div>
    </div>
  )
}
