import Layout from "@/components/Layout";
import { getShortAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { useDisconnect } from 'wagmi'
import { CardButton } from "@/components/CardButton";
import Edit from "@/icons/Edit";
import Rocket from "@/icons/Rocket";
import { InfoCard } from "@/components/InfoCard";
import { EditProfile } from "@/components/EditProfile";

export default function Index() {
  const [activeTab, setActiveTab] = useState(1);
  const { address } = useAccount()
  const [user, setUser] = useState<any>()
  const { disconnect } = useDisconnect()

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
    <Layout backButtonText="Back">
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div className="w-full">

          <EditProfile address={address} />
        </div>
      </div>
    </Layout>
  )
}
