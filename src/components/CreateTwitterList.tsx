import { useAuth } from '@/context/AuthContext';
import addData from '@/firebase/firestore/addData';
import React, { useEffect, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { uuid } from 'uuidv4';
import { Loading } from './Loading';
import { Toggle } from './Toggle';
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { NewListForm } from './NewListForm';
import { NewListPreview } from './NewListPreview';
import { NewListCreated } from './NewListCreated';

interface ListType {
  name: string
  description: string
  isPrivate: boolean
  listId?: string
  image?: string
}

export const CreateTwitterList = () => {
  const [user, setUser] = useState<any>()
  const { address } = useAuth()
  const [error, setError] = useState(null);
  const [errorFirebase, setErrorFirebase] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [listCreated, setListCreated] = useState(false);
  const [createdListInformation, setCreatedListInformation] = useState<any>({});
  const [listData, setListData] = useState<ListType>({
    name: '',
    description: '',
    isPrivate: false,
    listId: '',
    image: ''
  })
  const [activeTab, setActiveTab] = useState(0);

  const createList = async (event: any) => {
    setLoading(true)

    await fetch('/api/twitter/create-list-user-v2',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...listData, ...user })
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
        setActiveTab(2)
        setLoading(false)
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
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', address ?? '')
      const docSnap = await getDoc(usersRef)
      return docSnap.data()
    }

    if (address) {
      getUserInfo().then((result: any) => {
        setUser(result)
      })
    }
  }, [address]);

  return (
    <div className='w-full'>
      {activeTab != 2 &&
        <div>
          <h1 className='text-3xl'>Create List</h1>
          {activeTab === 0 && <p className='text-base'>Please complete the following details</p>}
          {activeTab === 1 && <p className='text-base'>Please complete the list details and launch it</p>}
        </div>
      }

      {activeTab === 0 &&
        <NewListForm
          setStep={setActiveTab}
          listData={listData}
          setListData={setListData}
          error={error}
          onSubmit={createList}
          loading={loading}
        />
      }

      {activeTab === 1 &&
        <NewListPreview
          setStep={setActiveTab}
          listData={listData}
          setListData={setListData}
          error={error}
          onSubmit={createList}
          loading={loading}
        />
      }

      {listCreated && <NewListCreated listData={listData} createdListInformation={createdListInformation} />}
    </div>
  );
}

