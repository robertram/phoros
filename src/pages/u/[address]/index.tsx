import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { useRouter } from "next/router";
import { Profile } from "@/components/Profile";
import { query, collection, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { address } = useAuth()
  const router = useRouter();
  const addressParam = Array.isArray(router.query.address) ? router.query.address[1] : router.query.address;
  const [user, setUser] = useState<any>()
  const [refreshUser, setRefreshUser] = useState<boolean>(false)

  const getWhereParam = () => {
    let result;

    switch (true) {
      case addressParam?.includes('.eth'):
        result = "ens";
        break;
      case addressParam === undefined || addressParam === null:
        result = "username";
        break;
      default:
        result = addressParam?.startsWith('0x') ? "id" : "username";
        break;
    }
    return result
  }

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "users"), where(getWhereParam(), "==", addressParam));
      return await getDocuments({ customQuery })
    }

    if (addressParam) {
      getAllData().then((result: any) => {
        console.log('result', result);

        setUser(result.result[0])
      })
    }
  }, [addressParam, refreshUser]);

  console.log('user', user);


  return (
    <Layout backButtonText="Home" backButtonLink="/">
      <Profile user={user} loggedIn={address ? true : false} setRefreshUser={setRefreshUser} />
    </Layout>
  )
}
