import Create from "@/icons/Create"
import Link from "next/link"
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { useAuth } from "@/context/AuthContext";
import Button from "./Button";
import Modal from "./Modal";
import { AuthorizeButton } from "./AuthorizeButton";

export const FloatingButton = () => {
  const { address } = useAuth()

  const [user, setUser] = useState<any>()
  const [showVerifyWithTwitter, setShowVerifyWithTwitter] = useState<boolean>(false)

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

  console.log('user', user);
  

  if (!user?.refreshToken || !user?.accessToken) {
    return (
      <>
        <div>
          <button
            onClick={() => {
              setShowVerifyWithTwitter(true)
            }}
            className="flex text-white rounded-full !bg-[#4BA3E3] !w-[60px] !h-[60px] no-underline fixed bottom-[20px] right-[20px] z-50"
          >
            <Create className="m-auto" />
          </button>
        </div>
        <Modal
          show={showVerifyWithTwitter}
          setShow={() => setShowVerifyWithTwitter(false)}
        >
          <div className="py-[10px]">
            <div className="flex justify-between">
              <h2 className="text-xl mb-[10px]">You need to verify to create a list</h2>

              <button
                className="ml-[10px]"
                onClick={() => setShowVerifyWithTwitter(false)}
              >
                Close
              </button>
            </div>


            {/* <Link
              href='/authorize'
              className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
            >
              Verify with X (twitter)
            </Link> */}

            <AuthorizeButton />
          </div>

        </Modal>
      </>
    )
  } else {

    return (
      <Link
        href="/create-list"
        className="flex text-white rounded-full bg-[#4BA3E3] w-[60px] h-[60px] no-underline fixed bottom-[20px] right-[20px] z-50"
      >
        <Create className="m-auto" />
      </Link>
    )
  }
}