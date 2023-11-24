import { useEffect, useState } from "react"
import { Loading } from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { PoapCard } from "./PoapCard";
import useTatum from "@/hooks/useTatum";

interface NFTsSelectionProps {
  nftsSelection: any
  setNFTSSelection: (poap: any) => void
}

export const NFTsSelection = ({ nftsSelection, setNFTSSelection }: NFTsSelectionProps) => {
  const { address } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const tatum = useTatum()

  useEffect(() => {
    const getNFTs = async () => {
      setLoading(true)
      const balance = await tatum?.nft.getBalance({ addresses: [address] })
      setNFTs(balance.data)
      tatum?.destroy()
      setLoading(false)
    }

    getNFTs()
      .catch(console.error);
  }, [tatum])

  console.log('nfts', nfts);

  return (
    <div className="flex flex-wrap gap-3 overflow-y-scroll max-h-[78vh]">
      {nfts.map((item, index) => {
        const isSelected = nftsSelection.some((nft: any) => nft === `${item?.tokenAddress}-${item?.tokenId}`);
        const eventString = `${item?.tokenAddress}-${item?.tokenId}`

        if (Object.keys(item?.metadata).length === 0 && item?.metadata.constructor === Object) {
          return null
        }

        return (
          <PoapCard
            name={item?.metadata?.name}
            image={item?.metadata.image}
            selected={isSelected}
            onClick={() => {
              if (!isSelected) {
                setNFTSSelection((oldArray: any) => [...oldArray, eventString]);
              } else {
                setNFTSSelection((oldArray: any) => oldArray.filter((poap: any) => poap !== `${item?.tokenAddress}-${item?.tokenId}`));
              }
            }}
            key={index}
          />
        )
      })}
    </div>
  )
}