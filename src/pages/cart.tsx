import Layout from "@/components/Layout";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { Checkout } from "@/components/Checkout";

export default function Index() {
  const router = useRouter()
  const [plans, setPlans] = useState<any>([])

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "plans"));
      return await getDocuments({ customQuery })
    }
    getAllData().then((result: any) => {
      setPlans(result.result)
    })
  }, []);

  console.log('plans', plans);

  return (
    <Layout>
      <div className="w-full">
        <Checkout />
      </div>
    </Layout>
  )
}