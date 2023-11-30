import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal"
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "./Loading";
import { query, collection, where } from "firebase/firestore";
import { db, getDocuments } from '@/firebase/firestore/getData';

interface UsernameModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  setRefreshUser: (refreshUser: any) => void
}

export const UsernameModal = ({ open, setOpen, setRefreshUser }: UsernameModalProps) => {
  const { address, ens } = useAuth()
  const [username, setUsername] = useState(ens ?? '');
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const [usernameError, setUsernameError] = useState('');

  const updateUserUsername = async () => {
    setLoading(true)
    const usersRef = doc(db, 'users', address ?? '')
    const data = {
      username: username
    }
    try {
      await setDoc(usersRef, { ...data }, { merge: true })
    } catch (err) {
      console.error('You dont have permission')
    }

    setLoading(false)
    setOpen(false)
    setUsername('')
  }

  const getAllData = async () => {
    const customQuery = query(collection(db, "users"), where("username", "==", username));
    return await getDocuments({ customQuery })
  }

  const registerUser = async () => {
    setLoading(true)
    getAllData().then((result: any) => {
      console.log('result', result.result);
      if (result.result.length > 0) {
        console.log('Username is already taken. Please choose a different one.');
        setUsernameError('Username is already taken. Please choose a different one.');
      } else {
        updateUserUsername()
        setRefreshUser((prevRefreshUser: boolean) => !prevRefreshUser);
      }
    })
    setLoading(false)
  }

  const closeModal = () => {
    setUsername('')
    setUsernameError('')
    setOpen(false)
  }

  return (
    <div>
      <Modal
        show={open}
        setShow={() => closeModal()}
      >
        <div className="">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl mb-[10px]">Complete your profile</h2>
              <h2 className="text-base mb-[10px]">Set your account username</h2>
            </div>

            <button
              className="ml-[10px]"
              onClick={() => closeModal()}
            >
              Close
            </button>
          </div>
          <div className=''>
            {ens && <p>ENS detected</p>}
            <input
              type='text'
              id='username'
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='elonmusk'
              value={ens ? ens : username}
              onChange={(event) => {
                setUsername(event.target.value)
              }}
            />
          </div>
          <p className="text-base text-red-400">{usernameError}</p>

          <Button
            disabled={username == '' || loading}
            onClick={() => {
              registerUser()
            }}
            className={`flex justify-center mt-[10px] ${username == '' ? 'bg-primary' : 'bg-[#91D1F8]'}`}
          >
            {loading ?
              <Loading className="mx-auto flex justify-center" /> :
              'Confirm'
            }
          </Button>
        </div>
      </Modal>
    </div>
  )
}