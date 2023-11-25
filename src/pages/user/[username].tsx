import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { useRouter } from "next/router";
import { Profile } from "@/components/Profile";
import { query, collection, where } from "firebase/firestore";

export default function Index() {
  const router = useRouter();
  const username = Array.isArray(router.query.username) ? router.query.username[1] : router.query.username;
  const [user, setUser] = useState<any>()

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "users"), where("username", "==", username));
      return await getDocuments({ customQuery })
    }

    if (username) {
      getAllData().then((result: any) => {
        console.log('result', result);
        
        setUser(result.result[0])
      })
    }
  }, [username]);

  return (
    <Layout backButtonText="Home" backButtonLink="/">
      <Profile user={user} loggedIn={false} />
    </Layout>
  )
}
