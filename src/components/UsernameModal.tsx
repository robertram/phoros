import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal"
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { db } from '@/firebase/firestore/getData';
import { useAuth } from "@/context/AuthContext";
import { Loading } from "./Loading";

interface UsernameModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const UsernameModal = ({ open, setOpen }: UsernameModalProps) => {
  const { address } = useAuth()
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false)
  const router = useRouter();

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
  }

  return (
    <div>
      <Modal
        show={open}
        setShow={() => setOpen(false)}
      >
        <div className="">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl mb-[10px]">Complete your profile</h2>
              <h2 className="text-base mb-[10px]">Set your account username</h2>
            </div>

            <button
              className="ml-[10px]"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <div className=''>
            <input
              type='text'
              id='username'
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='elonmusk'
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
              }}
            />
          </div>

          <Button
            disabled={username == '' || loading}
            onClick={() => {
              updateUserUsername()
            }}
            className={`flex justify-center mt-[10px] ${username == '' ? 'bg-primary' : 'bg-[#91D1F8]'}`}
          >
            {loading ?
              <Loading className="mx-auto flex justify-center"/> :
              'Confirm'
            }
          </Button>
        </div>
      </Modal>
    </div>
  )
}