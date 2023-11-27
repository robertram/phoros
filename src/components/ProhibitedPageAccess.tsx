import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { AuthorizeButton } from "./AuthorizeButton";
import { ConnectButton } from "./ConnectButton";

interface ProhibitedPageAccessProps {
  children: any
  text?: string
  checkLoggedIn?: boolean
  checkAuthorization?: boolean
}

export default function ProhibitedPageAccess({ children, checkAuthorization, checkLoggedIn }: ProhibitedPageAccessProps) {
  const { address } = useAuth()
  const [user, setUser] = useState<any>()

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

  const LoggedOut = () => {
    return (
      <div className="mt-[20px] w-full">
        <h1 className="text-2xl text-center">You need to be logged in to access this page</h1>
        <div className="mt-[10px] mx-auto flex justify-center">
          <ConnectButton />
        </div>
      </div>
    )
  }

  const TwitterAuthNeeded = () => {
    return (
      <div className="mt-[20px] w-full">
        <h1 className="text-2xl text-center">You need to authorize your account to access this page</h1>
        <div className="mt-[20px] mx-auto flex justify-center">
          <AuthorizeButton />
        </div>
      </div>
    )
  }

  if (checkLoggedIn && !address) {
    return <LoggedOut />
  } else {
    if (checkAuthorization && (!user?.refreshToken || !user?.accessToken)) {
      return <TwitterAuthNeeded />
    }
  }

  return children
}
