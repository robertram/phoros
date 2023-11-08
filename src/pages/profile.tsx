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
import { Router, useRouter } from "next/router";

export default function Index() {
  const [activeTab, setActiveTab] = useState(1);
  const { address } = useAccount()
  const [user, setUser] = useState<any>()
  const { disconnect } = useDisconnect()
  const router = useRouter()

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
    <Layout backButtonText="Home" backButtonLink="/">
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div className="w-full">
          <div className="m-auto">
            <img src={user?.image} className="w-[100px] h-[100px] object-cover m-auto rounded-full bg-gray-500" />
          </div>

          <div className="mt-[20px]">
            <p className="text-base font-bold text-center">{getShortAddress(address)}</p>
          </div>

          <div className="flex justify-between gap-4 mt-[50px]">
            <InfoCard
              title="Collectibles"
              value="7"
              icon={<Edit className="m-auto" />}
            />
            <InfoCard
              title="Lists"
              value="0"
              icon={<Rocket className="m-auto" />}
            //loading={loading}
            />
          </div>

          <div className="flex justify-between gap-4 mt-[50px]">
            <CardButton
              onClick={() => {
                router.push('/edit-profile')
              }}
              title="Edit"
              icon={<Edit className="m-auto" />}
            />
            <CardButton
              onClick={() => disconnect()}
              title="Logout"
              icon={<Rocket className="m-auto" />}
            //loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
