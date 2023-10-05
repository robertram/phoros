import { useContract, useNFTs } from "@thirdweb-dev/react";
import { getDocument } from "@/firebase/firestore/getData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EventType } from "@/types/types";
import { NFT } from "./NFT";
import { CheckoutNFT } from "./CheckoutNFT";
import { Loading } from "./Loading";

interface NFTPickerProps {
  onClick?: (tokenId: any) => void
  chosedNFT?: any
  freeEvent?: boolean
  onSuccess?: () => void
}

export const NFTPicker = ({ onClick, chosedNFT, freeEvent, onSuccess }: NFTPickerProps) => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const [eventData, setEventData] = useState<EventType | undefined>(undefined);

  const { contract, error } = useContract(eventData?.contractAddress.stringValue);
  const { data, isLoading } = useNFTs(contract);

  useEffect(() => {
    if (!id) return
    const getData = async () => {
      return await getDocument('events', id)
    }
    getData().then((result: any) => {
      setEventData(result.result._document.data.value.mapValue.fields)
    })
  }, [id]);

  if (!data) {
    return <Loading />
  }

  return (
    <div className="flex flex-wrap">
      {freeEvent && data && data.length > 0 &&
        data.map((nft) => {
          if (freeEvent) {
            return (
              <CheckoutNFT
                active={chosedNFT}
                id={nft.metadata.id}
                nft={nft}
                collectionAddress={eventData?.contractAddress.stringValue}
                marketplaceAddress={eventData?.marketplaceAddress.stringValue}
                onClick={() => { onClick && onClick(nft.metadata.id) }}
                key={nft.metadata.id}
                eventData={eventData}
                onSuccess={onSuccess}
              />
            )
          } else {
            return null
          }
          //  else {
          //   return (
          //     <NFT active={chosedNFT} id={nft.metadata.id} nft={nft} collectionAddress={eventData?.contractAddress.stringValue} marketplaceAddress={eventData?.marketplaceAddress.stringValue} onClick={() => { onClick && onClick(nft.metadata.id) }} key={nft.metadata.id} />
          //   )
          // }
        }
        )}

      {/* {!freeEvent &&
        <PayedNFTCheckout contractAddress={eventData?.contractAddress.stringValue} tokenId={chosedNFT} />
      } */}
    </div>
  )
}