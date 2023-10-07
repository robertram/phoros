import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3 from 'web3'
import POAP from '../../../abis/POAP.json'

export default function Community() {
  const router = useRouter();
  const tokenId = Array.isArray(router.query.tokenId) ? router.query.tokenId[1] : router.query.tokenId;
  const [tokenUri, setTokenUri] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [communityData, setCommunityData] = useState<any>()
  //

  const getTokenURI = async (tokenId: string) => {
    const web3 = new Web3('https://rpc.gnosischain.com');
    const nftContractAddress = '0x22c1f6050e56d2876009903609a2cc3fef83b415';
    const nftContract: any = new web3.eth.Contract(POAP, nftContractAddress);
    return await nftContract?.methods?.tokenURI(tokenId)
      .call()
      .then((tokenUri: any) => {
        if (tokenUri) {
          setTokenUri({
            uri: tokenUri,
            tokenId
          })
        }
      })
      .catch((error: any) => {
        console.error('Error fetching NFTs:', error);
      });
  }

  useEffect(() => {
    if (tokenId) {
      getTokenURI(tokenId)
    }
  }, [tokenId])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetch(tokenUri.uri)
        .then(response => {
          if (!response.ok) {
            throw new Error('Couldnt get poaps');
          }
          setLoading(false)
          return response.json()
        })
        .then(response => {
          setCommunityData(response)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
        });
    }

    fetchData()
      .catch(console.error);
  }, [tokenUri])

  if (loading) return <Loading />

  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div>
          <div>
            <img src={communityData?.image_url} className="w-[100px] h-[100px] object-cover" />
          </div>
          <h1 className="text-3xl">{communityData?.name}</h1>
        </div>
      </div>
    </Layout>

  )
}