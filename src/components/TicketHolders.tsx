import { ContractType } from "@/types/types";
import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import WalletUserInfo from "./WalletUserInfo";

interface EventFormProps {
  contractAddress: string
  setTicketHolders?: (count: number) => void
  setTotalTickets?: (count: number) => void
  setTicketsCategories?: (item: any) => void
  contractType: ContractType
}

export const TicketHolders = ({ contractAddress, setTicketHolders, setTotalTickets, setTicketsCategories, contractType }: EventFormProps) => {
  const { contract } = useContract(contractAddress);
  const [nfts, setNfts] = useState<any[] | undefined>([])
  const [totalNfts, setTotalNfts] = useState<any[] | undefined>([])

  console.log('totalNfts holders', totalNfts);

  useEffect(() => {
    const getNFTDropNfts = async () => {
      const nftsRes = await contract?.erc721.getAll();
      nftsRes?.map((item: any) => {
        if (item.owner !== "0x0000000000000000000000000000000000000000") {
          setNfts((oldArray: any) => [...oldArray, item]);
        }
        return null
      })
      setTotalNfts(nftsRes)
    }

    const getEditionDropNfts = async () => {
      const nftsRes = await contract?.erc1155.getAll();
      console.log('nftsRes', nftsRes);
      //setTicketsCategories(nftsRes)
      setTotalNfts(nftsRes)
    }

    if (contractType === ContractType.editionDrop) {
      getEditionDropNfts()
        .catch(console.error);
    } else if (contractType === ContractType.nftDrop) {
      getNFTDropNfts()
        .catch(console.error);
    }
  }, [contract])

  useEffect(() => {
    setTotalTickets && setTotalTickets(totalNfts?.length ?? 0)
    setTicketHolders && setTicketHolders(nfts?.length ?? 0)
    setTicketsCategories && setTicketsCategories(totalNfts ?? {})
  }, [nfts, totalNfts])

  return (
    <div>
      <p className="text-2xl">Ticket Holders</p>
      {nfts && nfts.map((item, index) => {
        return (
          <div key={index}>
            <WalletUserInfo address={item.owner} data={item} />
          </div>
        )
      })}
    </div>
  )

}
