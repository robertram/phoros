import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "@/firebase/firestore/getData";
import { getShortAddress } from "@/lib/utils";

interface WalletUserInfoProps {
  address: string
  data?: any
}

const WalletUserInfo = ({ address, data }: WalletUserInfoProps) => {
  const [userInfo, setUserInfo] = useState<any>()

  useEffect(() => {
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', address)
      const docSnap = await getDoc(usersRef)
      return docSnap.data()
    }

    if (address) {
      getUserInfo().then((result: any) => {
        setUserInfo(result)
      })
    }
  }, [address]);

  return (
    <div className="border-solid border-2 border-x-white mb-[10px]">
      {data && <p>ID #{data?.metadata?.id}</p>}
      <p>{getShortAddress(address)}</p>
      <p className="text-base">{userInfo?.name}</p>
      <p>{userInfo?.email}</p>
    </div>
  )

}

export default WalletUserInfo

