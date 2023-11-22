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
import { lchown } from 'fs';

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
  const [error, setError] = useState<any>(null);
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

  const domain = window.location.host

  const createListUrl = domain === 'localhost:3000' ? '/api/twitter/create-list-user' : `https://${domain}/api/twitter/create-list-user`

  const createList = async () => {
    setLoading(true);
    try {
      if (!user?.accessToken || !listData) {
        console.log('cant create list',);
        return;
      }

      let response: any = '';
      let accessToken = user.accessToken
      let expireTime = user?.expireTime

      if (!expireTime || Date.now() > expireTime) {
        console.log(401, 'user', user);

        const refreshResponse = await fetch('/api/twitter/refresh-token', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: user.id, refreshToken: user?.refreshToken })
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const refreshData = await refreshResponse.json();
        accessToken = refreshData.accessToken;
        expireTime = refreshData.expireIn;
      }

      response = await fetch(createListUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: listData?.name,
          description: listData?.description,
          isPrivate: listData?.isPrivate,
          accessToken: accessToken,
          expireTime: expireTime,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setCreatedListInformation(data);
      setListCreated(true)
      setActiveTab(2)
      setLoading(false)

    } catch (err) {
      console.error('Error creating list:', err);
      setError(err);
      setListCreated(false)
      setLoading(false)
    }

    setLoading(false);
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

      return { ...docSnap.data(), id: docSnap.id };
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

