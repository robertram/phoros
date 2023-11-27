import { useAuth } from '@/context/AuthContext';
import addData from '@/firebase/firestore/addData';
import React, { useEffect, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { uuid } from 'uuidv4';
import { Loading } from './Loading';
import { Toggle } from './Toggle';
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { NewListForm } from './NewListForm';
import { NewListPreview } from './NewListPreview';
import { NewListCreated } from './NewListCreated';
import { lchown } from 'fs';
import { useRouter } from 'next/router';
import { query, collection, where } from "firebase/firestore";
import { db, getDocuments } from '@/firebase/firestore/getData';
import OnlyOwnerPageAccess from './OnlyOwnerPageAccess';

interface ListType {
  name: string
  description: string
  isPrivate: boolean
  listId?: string
  image?: string
}

interface EditListProps {
  listId: string
}

export const EditList = ({ listId }: EditListProps) => {
  const router = useRouter()
  const [user, setUser] = useState<any>()
  const { address } = useAuth()
  const [error, setError] = useState<any>(null);
  const [errorFirebase, setErrorFirebase] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [listCreated, setListCreated] = useState(false);
  const [createdListInformation, setCreatedListInformation] = useState<any>({});
  const [listData, setListData] = useState<ListType | any>({
    name: '',
    description: '',
    isPrivate: false,
    listId: '',
    image: ''
  })
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "lists"), where("listId", "==", listId));
      return await getDocuments({ customQuery })
    }

    if (listId) {
      getAllData().then((result: any) => {
        setListData(result.result[0])
      })
    }
  }, [listId]);

  const updateList = async () => {
    setLoading(true)
    const usersRef = doc(db, 'lists', listData?.id)
    try {
      await setDoc(usersRef, { ...listData }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }

    setLoading(false)
    router.push('/')
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
      const usersRef = doc(db, 'lists', address ?? '')
      const docSnap = await getDoc(usersRef)

      return { ...docSnap.data(), id: docSnap.id };
    }

    if (address) {
      getUserInfo().then((result: any) => {
        setUser(result)
      })
    }
  }, [address]);

  console.log('listData', listData);

  return (
    <OnlyOwnerPageAccess ownerAddress={listData?.owner ?? ''}>
      <div className='px-4 max-w-large flex items-center m-auto w-full'>
        <div className='w-full'>
          {activeTab != 2 &&
            <div>
              <h1 className='text-3xl'>Edit List</h1>
              {activeTab === 0 && <p className='text-base'>Please complete the following details</p>}
              {activeTab === 1 && <p className='text-base'>Please check the list details and post the changes</p>}
            </div>
          }

          {activeTab === 0 &&
            <NewListForm
              setStep={setActiveTab}
              listData={listData}
              setListData={setListData}
              error={error}
              loading={loading}
              isEdit
            />
          }

          {activeTab === 1 &&
            <NewListPreview
              setStep={setActiveTab}
              listData={listData}
              setListData={setListData}
              error={error}
              onSubmit={updateList}
              loading={loading}
              isEdit
            />
          }

          {listCreated && <NewListCreated listData={listData} createdListInformation={createdListInformation} />}
        </div>
      </div>
    </OnlyOwnerPageAccess>
  );
}

