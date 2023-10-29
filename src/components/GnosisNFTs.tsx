import { useEffect, useState } from "react";
import POAP from '../abis/POAP.json'
import Web3 from 'web3'
import { PoapInfo } from "./PoapInfo";
import { useAccount } from "wagmi";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import { Loading } from "./Loading";

export const GnosisNFTs = () => {
  const { address } = useAccount()
  const [userBalance, setUserBalance] = useState<number>(0)
  const [tokensByUser, setTokensByUser] = useState<any[]>([])
  const [tokensUri, setTokensUri] = useState<any[]>([])
  const [lists, setLists] = useState<any[]>([])
  const [tokensWithLists, setTokensWithLists] = useState<any[]>([])

  const balanceOf = (address: string) => {
    const web3 = new Web3('https://rpc.gnosischain.com');
    const nftContractAddress = '0x22c1f6050e56d2876009903609a2cc3fef83b415';
    const nftContract: any = new web3.eth.Contract(POAP, nftContractAddress);
    nftContract?.methods?.balanceOf(address)
      .call()
      .then((balance: any) => {
        setUserBalance(balance)
      })
      .catch((error: any) => {
        console.error('Error fetching NFTs:', error);
      });
  }

  const tokenDetailsOfOwnerByIndex = async (address: string, index: number) => {
    const web3 = new Web3('https://rpc.gnosischain.com');
    const nftContractAddress = '0x22c1f6050e56d2876009903609a2cc3fef83b415';
    const nftContract: any = new web3.eth.Contract(POAP, nftContractAddress);
    return await nftContract?.methods?.tokenDetailsOfOwnerByIndex(address, index)
      .call()
      .then((tokenDetails: any) => {
        return tokenDetails
      })
      .catch((error: any) => {
        console.error('Error fetching NFTs:', error);
      });
  }

  const getTokenURI = async (tokenId: number) => {
    const web3 = new Web3('https://rpc.gnosischain.com');
    const nftContractAddress = '0x22c1f6050e56d2876009903609a2cc3fef83b415';
    const nftContract: any = new web3.eth.Contract(POAP, nftContractAddress);
    return await nftContract?.methods?.tokenURI(tokenId)
      .call()
      .then((tokenUri: any) => {
        if (tokenUri) {
          return {
            uri: tokenUri,
            tokenId
          }
        }
      })
      .catch((error: any) => {
        console.error('Error fetching NFTs:', error);
      });
  }

  const getTokensByUser = async (tokensByUser: any[]) => {
    const urisArray: any = []
    await tokensByUser.map(async (item: any) => {
      const tokenId = item?.tokenId;
      const tokenURI: any = await getTokenURI(tokenId)
      if (tokenURI) {
        setTokensUri((oldArray: any) => [...oldArray, {
          tokenId: tokenURI.tokenId,
          uri: tokenURI.uri
        }]);
      }
    })

    return urisArray
  }

  // 1- Get balance
  useEffect(() => {
    balanceOf(address ?? '');
  }, [address])

  // 2-  Get details of owner of each token
  useEffect(() => {
    (async () => {
      const tokenDetailsArray: any[] = []
      for (let i = 0; i < userBalance; i++) {
        const tokenDetails = await tokenDetailsOfOwnerByIndex(address ?? '', i)
        tokenDetailsArray.push(tokenDetails)
      }
      getTokensByUser(tokenDetailsArray)
    })();
  }, [userBalance])

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
    const filteredTokensURI = tokensUri.filter((tokenURI) => {
      const tokenEventId = tokenURI.uri.split('/')[4]
      return listEventIds.has(tokenEventId)
    });
    const mergedItems = filteredTokensURI.map((tokenURI) => {
      const tokenEventId = tokenURI.uri.split('/')[4]
      const matchingList = lists.find((list) => list.eventId === tokenEventId);
      if (matchingList) {
        return { ...tokenURI, ...matchingList };
      }
      return tokenURI;
    });

    setTokensWithLists(mergedItems)
  }

  useEffect(() => {
    if (lists && tokensUri) {
      getPoapsWithList()
    }
  }, [lists, tokensUri])

  if (tokensWithLists.length === 0) return <Loading />

  return (
    <div>
      {tokensWithLists.map((item, index) => {
        return (
          <PoapInfo data={item} key={index} />
        )
      })}
    </div>
  )
}