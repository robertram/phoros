import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { Profile } from "@/components/Profile";

export default function Index() {
  const { address } = useAccount()
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
    <Layout backButtonText="Home" backButtonLink="/">
      <Profile user={user} loggedIn />
    </Layout>
  )
}
