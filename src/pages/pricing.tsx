import Layout from "@/components/Layout";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import ProhibitedPageAccess from "@/components/ProhibitedPageAccess";
import { ConnectButton } from "@/components/ConnectButton";

export default function Index() {
  const router = useRouter()
  const [plans, setPlans] = useState<any>([])

  // const changeLanguage = (e: any) => {
  //   const locale = e.target.value;
  //   router.push(router.asPath, router.asPath, { locale })
  // }

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
        <h1 className="mb-[20px]">Pricing</h1>

        {plans && plans.map((item: any, index: number) => {
          return (
            <div
              className="border-solid border-2 border-gray-300 p-[20px] w-full cursor-pointer"
              key={index}
              onClick={() => {
                // router.push(`/cart?plan=${item?.name}`)
              }}
            >
              <p className="w-full">{item.name}</p>
            </div>
          )
        })}

        
      </div>
    </Layout>
  )
}