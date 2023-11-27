import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Button from "./Button";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { ConnectButton } from "./ConnectButton";
import { useRouter } from "next/router";

interface OnlyOwnerPageAccessProps {
  children: any
  text?: string
  checkLoggedIn?: boolean
  checkAuthorization?: boolean
  ownerAddress: string
}

export default function OnlyOwnerPageAccess({ children, ownerAddress }: OnlyOwnerPageAccessProps) {
  const { address } = useAuth()
  const router = useRouter()

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

  const NotOwner = () => {
    return (
      <div className="mt-[20px] w-full">
        <h1 className="text-2xl text-center">You are not the owner of this list</h1>
        <div className="mt-[10px] mx-auto flex justify-center">
          <Button
            className="w-max"
            onClick={() => {
              router.push('/')
            }}
          >
            Go back home
          </Button>
        </div>
      </div>
    )
  }

  if (!address) {
    return <LoggedOut />
  } else {
    if (ownerAddress != address) {
      return <NotOwner />
    }
  }

  return children
}
