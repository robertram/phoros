import { GnosisNFTs } from "@/components/GnosisNFTs";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { OwnedNFTs } from "@/components/OwnedNFTs";
import { getShortAddress } from "@/lib/utils";
import { useAccount } from "wagmi";

export default function Index() {
  const { address } = useAccount()

  return (
    <Layout>
      <NavBar />
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        {!address ?
          <div className="text-center w-full pt-[32px]">
            <h2 className="text-3xl font-bold">Keep Engaging with your community</h2>
            <p className="text-lg mt-[10px]">Get all your followers in one place thanks to your digital collectibles and X (twitter)</p>
            <div className="m-auto flex justify-center mt-[20px]">
            <w3m-button size='md' label='Join Phoros Now'  />
            </div>
          </div>
          :
          <div className="w-full">
            <h1 className="text-2xl font-bold">Welcome {getShortAddress(address)}</h1>
            <h2 className="mt-[10px] text-base font-semibold mb-[16px]">Recommended lists you can join</h2>
            {/* <OwnedNFTs /> */}
            <GnosisNFTs />
          </div>
        }
      </div>
    </Layout >
  )
}
