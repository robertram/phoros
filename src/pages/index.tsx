import Button from "@/components/Button";
import { GnosisNFTs } from "@/components/GnosisNFTs";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { OwnedNFTs } from "@/components/OwnedNFTs";
import { useAuth } from "@/context/AuthContext";
import { getShortAddress } from "@/lib/utils";

export default function Index() {
  const { address } = useAuth()

  return (
    <Layout>
      <NavBar />
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        {!address ?
          <div className="text-center w-full pt-[32px]">
            <h2 className="text-2xl font-bold">Lorem Ipsum</h2>
            <p className="text-base">Lorem Ipsum Lorem Ipsum</p>
            <Button className="">Join Phoros Now</Button>
          </div>
          :
          <div>
            <h1 className="text-3xl">Welcome {getShortAddress(address)}</h1>
            <h2 className="mt-[10px] text-2xl">Recommended lists you can join</h2>
            {/* <OwnedNFTs /> */}

            <GnosisNFTs />
          </div>
        }
      </div>
    </Layout >
  )
}
