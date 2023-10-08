import { useEffect, useState } from "react"
import { Loading } from "./Loading";
import { PoapItemContainer } from "./PoapItemContainer";

interface PoapInfoProps {
  uri: string
  tokenId: number
}

export const PoapInfo = ({ uri, tokenId }: PoapInfoProps) => {
  const [loading, setLoading] = useState(false);
  const [poapData, setPoapData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetch(uri)
        .then(response => {
          if (!response.ok) {
            throw new Error('Couldnt get poaps');
          }
          return response.json()
        })
        .then(response => {
          setPoapData(response)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
        });
    }

    fetchData()
      .catch(console.error);
  }, [])

  if (loading) return <Loading />

  const eventId = poapData?.external_url?.split('/')[4]

  return (
    <div>
      <PoapItemContainer title={poapData.name} image={poapData.image_url} eventId={eventId} tokenId={tokenId ?? ''} />
    </div>
  )
}