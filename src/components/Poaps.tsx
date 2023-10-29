import { useEffect, useState } from "react"
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { PoapItemContainer } from "./PoapItemContainer";

export const Poaps = () => {
  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useState<any[]>([])
  const [poaps, setPoaps] = useState<any[]>([])
  const [listsWithTokens, setListsWithTokens] = useState<any[]>([])
  const { address } = useAuth()

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "lists"));
      return await getDocuments({ customQuery })
    }
    getAllData().then((result: any) => {
      setLists(result.result)
    })
  }, []);

  const filterListsByPoaps = (lists: any, poaps: any) => {
    return lists?.filter((list: any) => {
      return list?.requiredPoaps?.some((poapString: any) => {
        const [eventId, tokenId] = poapString.split("-");
        console.log(poaps, 'eventId, tokenId', eventId, tokenId);

        return poaps.some((poap: any) => poap.event.id.toString() === eventId && poap.tokenId === tokenId);
      });
    });
  }

  useEffect(() => {
    if (lists && poaps) {
      const filteredLists = filterListsByPoaps(lists, poaps);
      console.log('filteredLists', filteredLists);
      setListsWithTokens(filteredLists)
    }
  }, [lists, poaps])

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
        setPoaps(response)
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
      {listsWithTokens.length === 0 &&
        <div>
          <h2 className="">There are no lists created for your poaps</h2>
        </div>
      }

      {listsWithTokens.map((item, index) => {
        return (
          <PoapItemContainer
            title={item.name}
            image={item.image}
            listId={item.listId}
          />
        )
      })}
    </div>
  )
}