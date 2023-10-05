import { usePaper } from "@/context/PaperContext";
import { getIpfsURL } from "@/lib/utils";
import { ContractType } from "@/types/types";
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import TicketCard from "./TicketCard";

interface TicketsFromEventProps {
  contractType: ContractType
  id: string
  contractAddress: string
  eventName?: string
}

export const TicketsFromEvent = ({ contractType, id, contractAddress, eventName }: TicketsFromEventProps) => {
  const { contract } = useContract(contractAddress);
  const { address } = usePaper();
  const { data: nfts, isLoading, error } = useOwnedNFTs(contract, address);

  console.log('nfts', nfts);


  return (
    <div className="">
      {nfts && nfts?.length > 0 && <p className="text-xl">{eventName}</p>}
      {nfts &&
        <div className="flex flex-wrap">

          <div className='flex flex-wrap'>
            {nfts?.map((nft, index) => {
              const imageUrl = getIpfsURL(nft.metadata.image)
              return (
                <div key={index}>
                  <TicketCard
                    title={`${nft?.metadata.name} #${nft?.metadata.id}`}
                    place={nft?.quantityOwned != undefined ? `owned: ${nft?.quantityOwned}` : ''}
                    //image={formattedIpfs ? formattedIpfs : ''}
                    image={imageUrl}
                    //thirdwebMetadata={nft?.metadata}
                    link={contractType === ContractType.editionDrop ? `/account/tickets/editionDrop/${contractAddress}/${nft?.metadata.id}` : `/account/tickets/${contractAddress}/${nft?.metadata.id}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      }
    </div>
  )
}