
import { alchemy } from "@/utils/alchemy";
import { useEffect, useState } from "react";

export default function Index() {
  const [nfts, setNFTs] = useState<any>()

  useEffect(() => {
    alchemy.nft.getNftsForOwner('0xc1d457128dEcAE1CC092728262469Ee796F1Ac45').then((nfts) => {
      setNFTs(nfts.ownedNfts)
    });
  }, [])

  console.log('nfts?.ownedNfts', nfts?.ownedNfts);

  return (
    <div className="">
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
  )
}
