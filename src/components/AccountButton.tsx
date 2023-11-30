import { useAuth } from "@/context/AuthContext"
import ArrowDown from "@/icons/ArrowDown"
import { getShortAddress } from "@/lib/utils"
import { useRouter } from "next/router"
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from '@/firebase/firestore/getData';

export const AccountButton = () => {
  const { address, ens } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<any>()

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
    <button
      onClick={() => {
        router.push(`/u/${user?.ens ? user?.ens : address}`)
      }}
      className="rounded-[50px] p-[10px] shadow-md flex ">
      <img src={user?.profilePicture} className="rounded-full w-[25px] h-[25px] my-auto mr-[5px] bg-slate-800 " />
      {ens ? ens : getShortAddress(address)}
      <ArrowDown />
    </button>
  )

}