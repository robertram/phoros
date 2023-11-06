import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./Button";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { AuthorizeButton } from "./AuthorizeButton";
import { ConnectButton } from "./ConnectButton";
//import { Login } from "./Login";

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

  // return (
  //   <div className="w-full mt-[100px]">
  //     <div className="text-center">
  //       <h1 className="text-2xl">{getText()}</h1>
  //     </div>

  //     <div className="m-auto flex">
  //       {/* <Login className="!w-[300px] m-auto" /> */}
  //       {checkAuthorization && (!user?.refreshToken || !user?.accessToken) ?
  //         <AuthorizeButton />
  //         :
  //         <></>
  //       }
  //     </div>
  //   </div>
  // )
}
