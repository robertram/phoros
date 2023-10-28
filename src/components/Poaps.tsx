import { useEffect, useState } from "react"
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { Loading } from "./Loading";
import { PoapInfo } from "./PoapInfo";

export const Poaps = () => {
  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useState<any[]>([])
  const [nfts, setNFTs] = useState<any[]>([])
  const [tokensWithLists, setTokensWithLists] = useState<any[]>([])

  console.log('tokensWithLists', tokensWithLists);


  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "lists"));
      return await getDocuments({ customQuery })
    }
    getAllData().then((result: any) => {
      setLists(result.result)
    })
  }, []);

  const getPoapsWithList = () => {
    const listEventIds = new Set(lists.map((list) => list.eventId));
    const filteredTokensURI = nfts.filter((tokenURI) => {
      const tokenEventId = tokenURI.event.id.toString()

      return listEventIds.has(tokenEventId)
    });

    console.log('filteredTokensURI!!', filteredTokensURI);

    const mergedItems = filteredTokensURI.map((tokenURI) => {

      console.log('mergedItems tokenURI', tokenURI);

      const tokenEventId = tokenURI.event.id.toString()
      const matchingList = lists.find((list) => list.eventId === tokenEventId);
      if (matchingList) {
        return { ...tokenURI, ...matchingList };
      }
      return tokenURI;
    });

    setTokensWithLists(mergedItems)
  }

  useEffect(() => {
    if (lists && nfts) {
      getPoapsWithList()
    }
  }, [lists, nfts])

  const getPoaps = async () => {
    setLoading(true)
    await fetch('https://api.poap.tech/actions/scan/0xc1d457128dEcAE1CC092728262469Ee796F1Ac45',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.NEXT_PUBLIC_POAP_API_KEY}`
        },
        //body: JSON.stringify({})
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

        //setError(err.message);
        setLoading(false)
      });
    setLoading(false)
  }

  useEffect(() => {
    getPoaps()
  }, [])

  if (tokensWithLists.length === 0) return <Loading />

  return (
    <div>
      {tokensWithLists.map((item, index) => {
        return (
          <PoapInfo data={item} uri={item.uri} tokenId={item.tokenId} key={index} />
        )
      })}
    </div>
  )
}