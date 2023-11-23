

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNetwork } from 'wagmi'
import useTatum from "@/hooks/useTatum";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { TokenInfo } from "./TokenInfo";

export const OwnedNFTs2 = () => {
  const { chain } = useNetwork()
  const { address } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const [lists, setLists] = useState<any[]>([])
  //const [tokensWithLists, setTokensWithLists] = useState<any[]>([])
  const [listsWithTokens, setListsWithTokens] = useState<any[]>([])

  const tatum = useTatum()

  useEffect(() => {
    const getNFTs = async () => {
      setLoading(true)
      const balance = await tatum.nft.getBalance({ addresses: [address] })
      setNFTs(balance.data)
      tatum.destroy()
      setLoading(false)
    }

    getNFTs()
      .catch(console.error);
  }, [tatum])

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "lists"));
      return await getDocuments({ customQuery })
    }
    getAllData().then((result: any) => {
      setLists(result.result)
    })
  }, []);

  console.log('lists', lists);

  const filterListsByNFTs = (lists: any, nfts: any) => {
    return lists?.filter((list: any) => {
      return list?.requiredNFTs?.some((nftString: any) => {
        console.log('nftString', nftString);
        
        const [tokenAddress, tokenId] = nftString.split("-");
        return nfts.some((nft: any) => nft.tokenAddress.toString() === tokenAddress);
      });
    });
  }

  useEffect(() => {
    if (lists && nfts) {
      const filteredLists = filterListsByNFTs(lists, nfts);
      setListsWithTokens(filteredLists)
    }
  }, [lists, nfts])

  console.log('listsWithTokens', listsWithTokens);
  

  // const getNFTsWithList = () => {
  //   const listEventIds = new Set(lists.map((list) => list.contractAddress));
  //   const filteredTokensURI = nfts.filter((tokenURI) => {
  //     //const tokenEventId = tokenURI.uri.split('/')[4]
  //     return listEventIds.has(tokenURI.tokenAddress)
  //   });

  //   const mergedItems = filteredTokensURI.map((tokenURI) => {
  //     // const tokenEventId = tokenURI.uri.split('/')[4]
  //     const matchingList = lists.find((list) => list.contractAddress === tokenURI.tokenAddress);
  //     if (matchingList) {
  //       return { ...tokenURI, ...matchingList };
  //     }
  //     return tokenURI;
  //   });

  //   setTokensWithLists(mergedItems)
  // }

  // useEffect(() => {
  //   if (lists?.length > 0 && nfts?.length > 0) {
  //     getNFTsWithList()
  //   }
  // }, [lists, nfts])

  //alchemy.nft.getContractMetadata
  //if (tokensWithLists.length === 0) return <Loading />

  //if (loading) return <Loading />

  return (
    <div className="">
      {/* {!nfts &&
        <div>
          <h2 className="">You dont have nfts in this network</h2>
        </div>
      } */}

      {listsWithTokens.length === 0 &&
        <div>
          <h2 className="">There are no lists created for your nfts</h2>
        </div>
      }

      {listsWithTokens.map((item, index) => {
        return (
          <TokenInfo data={item} key={index} />
        )
      })}
    </div>
  )
}
