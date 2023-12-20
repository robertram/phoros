import { useContract, useNFTs } from "@thirdweb-dev/react";
import { getDocument } from "@/firebase/firestore/getData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EventType } from "@/types/types";
import { NFT } from "./NFT";
import { Loading } from "./Loading";
import { useSearchParams } from "next/navigation";

interface NFTPickerProps {
  onClick?: (tokenId: any) => void
  chosedNFT?: any
  freeEvent?: boolean
  onSuccess?: () => void
}

export const PaidNFTPicker = ({ onClick, chosedNFT, freeEvent, onSuccess }: NFTPickerProps) => {
  const searchParams = useSearchParams()
  const ticketParameter = searchParams.get('ticket')
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const [eventData, setEventData] = useState<EventType | undefined | any>(undefined);
  const [ticketsInfo, setTicketsInfo] = useState<any>({})

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

  useEffect(() => {
    const tickets: any[] = []

    data?.map((item, index) => {
      const ticketName = `ticketName${index + 1}`;
      const ticketPrice = `ticketPrice${index + 1}`;
      const ticketHidden = `ticketHidden${index + 1}`;
      //const propertyNamePrice = `ticketPrice${ticketNumber}`;

      const name = eventData[ticketName]?.stringValue
      const price = eventData[ticketPrice]?.stringValue
      const hidden = eventData[ticketHidden]?.booleanValue

      tickets.push({
        name,
        price,
        hidden
      })
      return null
    })
    setTicketsInfo(tickets)

  }, [eventData, data]);

  useEffect(() => {
    if (ticketParameter != null) {
      onClick && onClick(ticketParameter)
    }
  }, [ticketParameter])

  useEffect(() => {
    let firstTicketChoosed = false
    if (ticketsInfo.length > 0) {
      ticketsInfo?.map((item: any, index: number) => {
        if (item.hidden === undefined && firstTicketChoosed === false) {
          firstTicketChoosed = true
          onClick && onClick(index)
          return null
        } else if (ticketParameter != undefined) {
          onClick && onClick(ticketParameter)
          firstTicketChoosed = true
          return null
        }
        return null
      })
    }
  }, [ticketsInfo])

  if (!data) {
    return <Loading />
  }

  return (
    <div className="flex flex-wrap">
      {data && data.length > 0 &&
        data.map((nft, index) => {
          if (ticketsInfo[index]?.hidden) {
            if (ticketParameter == nft.metadata.id) {
            } else {
              return <div key={index}></div>
            }
          }
          return (
            <NFT
              active={chosedNFT}
              id={nft.metadata.id}
              nft={nft}
              collectionAddress={eventData?.contractAddress.stringValue}
              marketplaceAddress={eventData?.marketplaceAddress.stringValue}
              onClick={() => { onClick && onClick(nft.metadata.id) }}
              key={nft.metadata.id}
              price={ticketsInfo[index]?.price}
            />
          )
        }
        )}

      {/* {!freeEvent &&
        <PayedNFTCheckout contractAddress={eventData?.contractAddress.stringValue} tokenId={chosedNFT} />
      } */}
    </div>
  )
}