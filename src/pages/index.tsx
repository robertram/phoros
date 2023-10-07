import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { Network, Alchemy } from 'alchemy-sdk'
import { useEffect, useState } from "react";

export default function Index() {
  const [nfts, setNFTs] = useState<any>()
  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: process.env.NEXT_PUBIC_ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  useEffect(() => {
    const nfts: any = alchemy.nft.getNftsForOwner('0xc1d457128dEcAE1CC092728262469Ee796F1Ac45').then((nfts) => {
      console.log('nfts!!', nfts);
      setNFTs(nfts.ownedNfts)
    });

  }, [])

  console.log('nfts?.ownedNfts', nfts?.ownedNfts);

  return (
    <Layout>
      <NavBar />
      <div className='px-4 max-w-large flex items-center m-auto'>

        <div>
          {nfts && nfts?.map((item: any, index: number) => {
            console.log('item', item);
            return (
              <div key={index}>
                <p className="text-1xl">{item?.title}</p>
                <img src={item?.media[0]?.gateway} className="w-[200px] h-[200px] object-cover"></img>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
