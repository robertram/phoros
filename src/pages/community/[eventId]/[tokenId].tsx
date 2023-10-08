import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3 from 'web3'
import POAP from '../../../abis/POAP.json'
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where } from "firebase/firestore";
import Modal from "@/components/Modal";

export default function Community() {
  const router = useRouter();
  const tokenId = Array.isArray(router.query.tokenId) ? router.query.tokenId[1] : router.query.tokenId;
  const eventId = Array.isArray(router.query.eventId) ? router.query.eventId[1] : router.query.eventId;
  const [tokenUri, setTokenUri] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [communityData, setCommunityData] = useState<any>()
  const [userAddedToList, setUserAddedToList] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [listInfo, setListInfo] = useState<any>({});
  const [showEnterUsername, setShowEnterUsername] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');

  const getUserId = async () => {
    setLoading(true)
    await fetch('/api/twitter/get-user-id',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: twitterUsername })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        setUserInfo(response?.data)
        addUserToList()
        setLoading(false)
        setShowEnterUsername(false)
        setTwitterUsername('')
      })
      .catch((err) => {
        setLoading(false)
        setShowEnterUsername(false)
        setTwitterUsername('')
      });
    setLoading(false)
  }

  const addUserToList = async () => {
    setLoading(true)

    await fetch('/api/twitter/add-user-to-list',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userInfo?.id, listId: listInfo?.listId })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        setUserAddedToList(true)
        setLoading(false)
        setTwitterUsername('')
      })
      .catch((err) => {
        setUserAddedToList(false)
        setLoading(false)
        setTwitterUsername('')
      });
    setLoading(false)
  }

  // useEffect(() => {
  //   addUserToList()
  // }, [userInfo])

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

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "lists"), where("eventId", "==", eventId));
      return await getDocuments({ customQuery })
    }

    if (eventId) {
      getAllData().then((result: any) => {
        setListInfo(result.result[0])
      })
    }
  }, [eventId]);

  console.log('listInfo!', listInfo);

  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div>
          <div>
            <img src={communityData?.image_url} className="w-[100px] h-[100px] object-cover" />
          </div>
          <h1 className="text-3xl">{communityData?.name}</h1>

          {listInfo &&
            <Button
              disabled={loading}
              className=""
              onClick={() => setShowEnterUsername(true)}
            >
              {loading ? <Loading /> : 'Join List'}
            </Button>
          }

          {!listInfo &&
            <p className="text-base">There are no lists for this event</p>
          }

          <a
            rel="noreferrer"
            target="_blank"
            href={`https://twitter.com/i/lists/${listInfo?.listId}`}
          >
            Open in twitter
          </a>

          <Modal
            show={showEnterUsername}
            setShow={() => setShowEnterUsername(false)}
          >
            <div className="">
              <div className="flex justify-between">
                <h2 className="text-xl mb-[10px]">Please enter your twitter handle to continue</h2>

                <button
                  className="ml-[10px]"
                  onClick={() => setShowEnterUsername(false)}
                >
                  Close
                </button>
              </div>
              <div className='mb-[20px]'>
                <label htmlFor='username'>X handle</label>
                <input
                  type='text'
                  id='username'
                  className='border border-gray-300 rounded-md p-2 w-full text-black'
                  placeholder='Enter the List Description'
                  value={twitterUsername}
                  onChange={(event) =>
                    setTwitterUsername(event.target.value)
                  }
                />
              </div>

              <Button
                disabled={twitterUsername == ''}
                onClick={() => {
                  getUserId()
                }}
                className={`mt-[0]  ${twitterUsername == '' ? 'bg-[#4BA3E3]' : 'bg-[#91D1F8]'}`}
              >
                Confirm
              </Button>

            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  )
}