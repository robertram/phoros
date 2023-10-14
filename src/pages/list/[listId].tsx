import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Web3 from 'web3'
import POAP from '@/abis/POAP.json'
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where, arrayUnion } from "firebase/firestore";
import Modal from "@/components/Modal";
import editData from "@/firebase/firestore/editData";
import { limitStringTo200Characters, removeAtSymbol } from "@/utils/utils";
import { CardButton } from "@/components/CardButton";
import AddUser from "@/icons/AddUser";
import Twitter from "@/icons/Twitter";
import { PoapInfo } from "@/components/PoapInfo";
import { PoapItemContainer } from "@/components/PoapItemContainer";
import { Loading } from "@/components/Loading";
import { ResponseDto, NftTokenDetail } from '@tatumio/tatum'
import useTatum from "@/hooks/useTatum";

export default function Community() {
  const tatum = useTatum()
  const router = useRouter();
  const tokenId = Array.isArray(router.query.tokenId) ? router.query.tokenId[1] : router.query.tokenId;
  const listId = Array.isArray(router.query.listId) ? router.query.listId[1] : router.query.listId;
  //const eventId = Array.isArray(router.query.eventId) ? router.query.eventId[1] : router.query.eventId;
  const [tokenUri, setTokenUri] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [userAddedToList, setUserAddedToList] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [listInfo, setListInfo] = useState<any>();
  const [showEnterUsername, setShowEnterUsername] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [addToListError, setAddToListError] = useState(false)
  const [error, setError] = useState('')
  const [tokenData, setTokenData] = useState<any>({});
  const [requiredNFTs, setRequiredNFTs] = useState<any[]>([]);
  const [requiredPOAPs, setRequiredPOAPs] = useState<any[]>([]);
  const [requiredPOAPsURI, setRequiredPOAPsURI] = useState<any[]>([]);

  const getUserId = async (twitterUsername: string) => {
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

  useEffect(() => {
    if (userInfo?.id && listInfo?.listId) {
      addUserToList()
    }
  }, [userInfo])

  const addUserToFirebaseList = async (id: string, data: any) => {
    if (!id) return

    const { result, error } = await editData('lists', id, data)
    if (error) {
      //setError(`Firebase error: ${error}`)
      return console.log('Add to firebase error', error)
    }
    return { result }
  }

  const addUserToList = async () => {
    setLoading(true)
    if (!userInfo?.id || !listInfo?.listId) {
      console.log('cant add to list', 'userInfo?.id', userInfo?.id, 'listInfo?.listId', listInfo?.listId)
      return null
    }

    // const usersArray = [
    //   ...listInfo?.waitlist,
    //   userInfo?.id
    // ]

    const isRepeated = listInfo?.waitlist?.includes(userInfo?.id);

    if (isRepeated) {
      setError('You are still on the waitlist')
      setLoading(false)
      return null
    }

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
        const dataToUpdate = {
          members: arrayUnion(userInfo?.id)
        };
        addUserToFirebaseList(listInfo.id, dataToUpdate)
        setUserAddedToList(true)
        setLoading(false)
        setTwitterUsername('')
      })
      .catch((err) => {
        const dataToUpdate = {
          waitlist: arrayUnion(userInfo?.id)
        };
        addUserToFirebaseList(listInfo.id, dataToUpdate)
        console.log('err', err);
        setAddToListError(true)
        setUserAddedToList(false)
        setLoading(false)
        setTwitterUsername('')
      });

    if (listId) {
      getAllData().then((result: any) => {
        setListInfo(result.result[0])
      })
    }
    setLoading(false)
  }

  const getPOAPsTokensURI = async (tokenId: string) => {
    const web3 = new Web3('https://rpc.gnosischain.com');
    const nftContractAddress = '0x22c1f6050e56d2876009903609a2cc3fef83b415';
    const nftContract: any = new web3.eth.Contract(POAP, nftContractAddress);

    await Promise.all(
      listInfo?.requiredNFTs.map(async (item: number) => {
        if (!requiredPOAPs.some(existingItem => existingItem?.split('/')[5] === item)) {

          await nftContract?.methods?.tokenURI(item)
            .call()
            .then((tokenUri: any) => {
              setRequiredPOAPs(oldArray => [...oldArray, tokenUri]);
            })
            .catch((error: any) => {
              console.error('Error fetching NFTs:', error);
            });
        }
      })
    )
  }

  useEffect(() => {
    const fetchRequiredPoapsURI = async () => {
      await Promise.all(
        requiredPOAPs.map(async (item) => {
          console.log('requiredPOAPs item', item);
          await fetch(item)
            .then(response => {
              if (!response.ok) {
                throw new Error('Couldnt get poaps');
              }
              //setLoading(false)
              return response.json()
            })
            .then(response => {
              setRequiredPOAPsURI(oldArray => [...oldArray, response]);
              //setTokenData(response)
            })
            .catch((err) => {
            });
        })
      )
    }
    if (requiredPOAPs.length > 0) {
      fetchRequiredPoapsURI()
        .catch(console.error);
    }
  }, [requiredPOAPs])

  useEffect(() => {
    if (listInfo?.isPoap && listInfo?.requiredNFTs > 0 && listInfo?.eventId) {
      getPOAPsTokensURI(listInfo?.requiredNFTs)
    }
  }, [listInfo])

  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true)
      await fetch(tokenUri.uri)
        .then(response => {
          if (!response.ok) {
            throw new Error('Couldnt get poaps');
          }
          //setLoading(false)
          return response.json()
        })
        .then(response => {
          setTokenData(response)
        })
        .catch((err) => {
        });
    }

    fetchData()
      .catch(console.error);
  }, [tokenUri])

  useEffect(() => {
    const fetchRequiredNFTsData = async () => {
      await Promise.all(
        listInfo?.requiredNFTs.map(async (item: number) => {
          if (!requiredNFTs.some(existingItem => existingItem?.tokenId === item)) {
            const metadata: ResponseDto<NftTokenDetail | null> = await tatum.nft.getNftMetadata({
              tokenAddress: listInfo?.contractAddress,
              tokenId: item
            })
            setRequiredNFTs(oldArray => [...oldArray, metadata.data]);
          }
        })
      )
    }

    if (!listInfo?.isPoap) {
      fetchRequiredNFTsData()
        .catch(console.error);
    }
  }, [listInfo])

  const getAllData = async () => {
    const customQuery = query(collection(db, "lists"), where("listId", "==", listId));
    return await getDocuments({ customQuery })
  }

  useEffect(() => {
    if (listId) {
      getAllData().then((result: any) => {
        setListInfo(result.result[0])
      })
    }
  }, [listId]);

  console.log('tokenData', tokenData);


  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div className="w-full">

          <div className="w-full">
            {listInfo ?
              <div>
                <div className="m-auto">
                  <img src={listInfo?.image} className="w-[100px] h-[100px] object-cover m-auto rounded-full" />
                </div>
                <h1 className="text-3xl text-center mt-[10px]">{listInfo?.name}</h1>
                <p className="text-base mt-[10px]">{limitStringTo200Characters(listInfo?.description)}</p>
              </div>
              :
              <div className="w-full flex justify-center">
                <Loading />
              </div>
            }

            {listInfo && <div className="flex justify-between gap-4 mt-[50px]">
              <CardButton
                onClick={() => {
                  window.open(`https://twitter.com/i/lists/${listInfo?.listId}`, '_blank');
                }}
                title="Open in X"
                icon={<Twitter className="m-auto" />}
              />
              <CardButton
                disabled={loading}
                onClick={() => setShowEnterUsername(true)}
                title="Join List"
                icon={<AddUser className="m-auto" />}
                loading={loading}
              />
            </div>}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {userAddedToList &&
            <p className="text-xl text-green-400">You were added to the list</p>
          }

          {!listInfo &&
            <p className="text-xl mt-[20px]">There are no lists for this event</p>
          }

          <div className="mt-[20px]">
            <h2 className="text-base font-medium">Collectibles Required</h2>
            {/* {listInfo?.isPoap && <PoapItemContainer title={tokenData.name} image={tokenData.image_url} />} */}

            {listInfo?.isPoap && requiredPOAPsURI.length > 0 && requiredPOAPsURI.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PoapItemContainer title={item?.name} image={item?.image_url} />
                </div>
              )
            })}

            {requiredNFTs.length > 0 && requiredNFTs.map((item: any, index: number) => {
              const image = item?.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");

              return (
                <div key={index}>
                  <PoapItemContainer title={item?.metadata?.name} image={image} />
                </div>
              )
            })}
          </div>

          <Modal
            show={addToListError}
            setShow={() => setAddToListError(false)}
          >
            <div className="">
              <div className="flex justify-between">
                <h2 className="text-xl mb-[10px]">You are on the list!</h2>
              </div>

              <div>
                <p className="">But you have to wait.</p>
                <p className="">You will become a member in 15 minutes aproximately.</p>
              </div>

              <Button
                onClick={() => {
                  setAddToListError(false)
                }}
              >
                Confirm
              </Button>
            </div>
          </Modal>

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
                  placeholder='Enter your X handle'
                  value={twitterUsername}
                  onChange={(event) => {
                    const userHandle = removeAtSymbol(event.target.value)
                    setTwitterUsername(event.target.value)
                  }}
                />
              </div>

              <Button
                disabled={twitterUsername == ''}
                onClick={() => {
                  getUserId(twitterUsername)
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