

import { useAuth } from "@/context/AuthContext";
import useAlchemy from "@/hooks/useAlchemy";
//import { alchemy } from "@/utils/alchemy";
import { useEffect, useState } from "react";
import { CollectionInfo } from "./CollectionInfo";
import { Loading } from "./Loading";
import { useConnect } from 'wagmi'
import { useNetwork } from 'wagmi'

export const OwnedNFTs = () => {
  const { chain } = useNetwork()
  const { address } = useAuth()
  const alchemy = useAlchemy(chain?.network)
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNFTs] = useState<any>()

  useEffect(() => {
    setLoading(true)
    alchemy?.nft?.getNftsForOwner(address).then((nfts: any) => {
      setNFTs(nfts.ownedNfts)
    });

    setLoading(false)
  }, [alchemy, address])

  console.log('nfts', nfts);

  //alchemy.nft.getContractMetadata

  if (loading) return <Loading />

  return (
    <div className="">
      {!nfts &&
        <div>
          <h2 className="">You dont have nfts in this network</h2>
        </div>
      }
      {nfts && nfts?.map((item: any, index: number) => {
        //console.log('item', item);
        return (
          <div key={index}>
            <CollectionInfo
              title={item?.title}
              image={item?.media[0]?.gateway}

            //contractAddress={item?.contract?.address} 
            />
        
          </div>
        )
      })}
    </div>
  )
}
