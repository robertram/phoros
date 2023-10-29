import { ConnectButton } from "@/components/ConnectButton";
import { FloatingButton } from "@/components/FloatingButton";
import Layout from "@/components/Layout";
import { OwnedNFTs2 } from "@/components/OwnedNFTs2";
import { Poaps } from "@/components/Poaps";
import { Tabs } from "@/components/Tabs";
import { getShortAddress } from "@/lib/utils";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Index() {
  const [activeTab, setActiveTab] = useState(1);
  const { address } = useAccount()

  const tabsList = ["NFTs", "POAPs"]

  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        {!address ?
          <div className="text-center w-full pt-[32px]">
            <h2 className="text-3xl font-bold">Keep Engaging with your community</h2>
            <p className="text-lg mt-[10px]">Get all your followers in one place thanks to your digital collectibles and X (twitter)</p>
            <div className="m-auto flex justify-center mt-[20px]">
              <ConnectButton text="Join Phoros Now" />
            </div>
          </div>
          :
          <div className="w-full">
            <h1 className="text-2xl font-bold">Welcome {getShortAddress(address)}</h1>
            <h2 className="mt-[10px] text-base font-semibold mb-[16px]">Recommended lists you can join</h2>
            {/* <OwnedNFTs /> */}

            <Tabs
              tabs={tabsList}
              activeTab={activeTab}
              setActiveTab={(tabIndex: number) => {
                setActiveTab(tabIndex)
              }}
            />
            {activeTab === 0 &&
              <OwnedNFTs2 />
            }
            {activeTab === 1 &&
              <Poaps />
            }

          </div>
        }
      </div>
      <FloatingButton />
    </Layout >
  )
}
