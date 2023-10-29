import { useEffect, useState } from "react"
import { Loading } from "./Loading";
import { useAuth } from "@/context/AuthContext";
import { PoapCard } from "./PoapCard";

interface PoapsSelectionProps {
  poapsSelection: any
  setPoapsSelection: (poap: any) => void
}

export const PoapsSelection = ({ poapsSelection, setPoapsSelection }: PoapsSelectionProps) => {
  const [loading, setLoading] = useState(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const { address } = useAuth()

  const getPoaps = async () => {
    setLoading(true)
    await fetch(`https://api.poap.tech/actions/scan/${address}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.NEXT_PUBLIC_POAP_API_KEY}`
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        console.log('poaps', response);
        setNFTs(response)
        //setAuthTwitter(response)
        setLoading(false)
        return response
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false)
      });
    setLoading(false)
  }

  useEffect(() => {
    getPoaps()
  }, [])

  return (
    <div>
      <div className="flex flex-wrap gap-3 overflow-y-scroll h-[600px]">
        {nfts.map((item, index) => {
          const isSelected = poapsSelection.some((poap: any) => poap ===  `${item?.event?.id}-${item?.tokenId}`);
          const eventString = `${item?.event?.id}-${item?.tokenId}`

          return (
            <PoapCard
              name={item?.event?.name}
              image={item?.event?.image_url}
              selected={isSelected}
              onClick={() => {
                if (!isSelected) {
                  setPoapsSelection((oldArray: any) => [...oldArray, eventString]);
                } else {
                  setPoapsSelection((oldArray: any) => oldArray.filter((poap: any) => poap.tokenId !== item.tokenId));
                }
              }}
              key={index}
            />
          )
        })}
      </div>
    </div>
  )
}