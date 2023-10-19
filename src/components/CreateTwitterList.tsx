import { useAuth } from '@/context/AuthContext';
import addData from '@/firebase/firestore/addData';
import React, { useEffect, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { uuid } from 'uuidv4';
import { Loading } from './Loading';
import { Toggle } from './Toggle';
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

interface ListType {
  name: string
  description: string
  isPrivate: boolean
  listId?: string
  image?: string
}

export const CreateTwitterList = () => {
  const { address } = useAuth()
  const [error, setError] = useState(null);
  const [errorFirebase, setErrorFirebase] = useState<string>('')
  const [loading, setLoading] = useState(false);

  const [listCreated, setListCreated] = useState(false);
  const [createdListInformation, setCreatedListInformation] = useState<any>({});
  const [authTwitterLink, setAuthTwitterLink] = useState<string>('');
  const [listData, setListData] = useState<ListType>({
    name: '',
    description: '',
    isPrivate: false,
    listId: '',
    image: ''
  })

  const createList = async (event: any) => {
    setLoading(true)
    event.preventDefault()
    await fetch('/api/twitter/create-list',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        setCreatedListInformation(response);
        setListCreated(true)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message);
        setListCreated(false)
        setLoading(false)
      });
    setLoading(false)
  }

  const getAuthLink = async () => {
    setLoading(true)
    await fetch('/api/twitter/auth',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        console.log('getAuthLink response', response);
        setAuthTwitterLink(response.url)
        setCreatedListInformation(response);
        setLoading(false)

        return response
      })
      .catch((err) => {
        setError(err.message);
        setListCreated(false)
        setLoading(false)
      });
    setLoading(false)
  }

  const addListToFirebase = async (data: any) => {
    const firebaseData = {
      ...listData,
      listId: data?.id,
      owner: address
    }

    const { result, error } = await addData('lists', uuid(), firebaseData)

    if (error) {
      setErrorFirebase(`Firebase error: ${error}`)
      return console.log('Add to firebase error', error)
    }
    return { result }
  }

  useEffect(() => {
    if (createdListInformation) {
      addListToFirebase(createdListInformation.data)
    }
  }, [listCreated])

  useEffect(() => {
    const getAuthLinkTwitter = async () => {
      const authLink = await getAuthLink()
      console.log('authLink useEffect', authLink);
    }
    getAuthLinkTwitter()
  }, [])

  return (
    <div>
      <h1 className='text-3xl'>Create List</h1>

      {listCreated && <div>
        <p className='text-green-400'>List Created</p>
        <div className='flex'>
          <a
            className='underline'
            rel="noreferrer"
            target="_blank"
            href={`https://twitter.com/i/lists/${createdListInformation?.data?.id}`}
          >{createdListInformation?.data?.name}</a>
          <button
            className='flex'
            onClick={() => { navigator.clipboard.writeText(`https://twitter.com/i/lists/${createdListInformation?.data?.id}`) }}
          >
            <AiOutlineCopy size={20} />
          </button>
        </div>
      </div>}

      {error && <p className='text-red-500'>{error}</p>}

      <form>
        <div className='mb-[20px]'>
          <label htmlFor='name'>List Name</label>
          <input
            type='text'
            id='name'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Enter the List Name'
            value={listData.name}
            onChange={(event) =>
              setListData({ ...listData, name: event.target.value })
            }
          />
        </div>
        <div className='mb-[20px]'>
          <label htmlFor='description'>List Description</label>
          <input
            type='text'
            id='description'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Enter the List Description'
            value={listData.description}
            onChange={(event) =>
              setListData({ ...listData, description: event.target.value })
            }
          />
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
                  const storageRef = ref(storage, `/${listData?.name + uuid()}/${image.name + uuid()}`)
                  const uploadTask = uploadBytesResumable(storageRef, image);
                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                      );
                      //setImageUploadPercentage(percent)
                    },
                    (err) => console.log(err),
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setListData({ ...listData, image: url })
                      });
                    }
                  );
                }

              }}
            />
          </div>

          {/* <div>{imageUploadPercentage > 1 && imageUploadPercentage < 100 ? `Uploading ${imageUploadPercentage}%...` : ''}</div> */}
          {listData.image && <img src={listData.image} className='w-auto h-[220px] object-cover' />}
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Is Private?</p>
              {/* <p className='text-body'>The users can resell their event tickets</p> */}
            </div>
            <div className='my-auto'>
              <Toggle
                name='isPending'
                checked={listData.isPrivate}
                onChange={(event) => {
                  setListData({ ...listData, isPrivate: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          onClick={createList}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
        >
          {loading ? <Loading /> : 'Create List'}
        </button>


      </form>

      <button onClick={getAuthLink}>Twitter auth</button>
      {authTwitterLink}
      <a
        className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
        href={authTwitterLink}>Authorize Twitter</a>
    </div>
  );
}

