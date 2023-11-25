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
import { useRouter } from "next/router";
import Twitter from "@/icons/Twitter";
import Telegram from "@/icons/Telegram";
import { LinkCard } from "@/components/LinkCard";
import usePoaps from "@/hooks/usePoaps";
import Discord from "@/icons/Discord";
import Linkedin from "@/icons/Linkedin";
import { Profile } from "@/components/Profile";

export default function Index() {
  const { address } = useAccount()
  const [user, setUser] = useState<any>()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(user?.id ?? '');

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
      <Profile user={user} loggedIn />
    </Layout>
  )
}
