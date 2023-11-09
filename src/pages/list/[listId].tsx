import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { doc, getDoc } from 'firebase/firestore';
import { fetchPoapToken } from "@/utils/poap";
import usePoaps from "@/hooks/usePoaps";
import { useAuth } from "@/context/AuthContext";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Success } from "@/components/Success";
import Share from "@/icons/Share";

export default function Community() {
  const { address } = useAuth()
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(address ?? '');
  const { open, close } = useWeb3Modal()
  const router = useRouter();
  const listId = Array.isArray(router.query.listId) ? router.query.listId[1] : router.query.listId;
  const [loading, setLoading] = useState(false);
  const [userAddedToList, setUserAddedToList] = useState(false);
  const [userAddedToWaitlist, setUserAddedToWaitlist] = useState(false);

  const [userInfo, setUserInfo] = useState<any>({});
  const [listInfo, setListInfo] = useState<any>();
  const [showEnterUsername, setShowEnterUsername] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [addToListError, setAddToListError] = useState(false)
  const [error, setError] = useState('')
  const [tokenData, setTokenData] = useState<any>({});
  const [requiredNFTs, setRequiredNFTs] = useState<any[]>([]);
  const [requiredPOAPs, setRequiredPOAPs] = useState<any[]>([]);
  const [choosenCollectibleToAssign, setChoosenCollectibleToAssign] = useState<any>({});

  const [user, setUser] = useState<any>()
  const [newTokenInfo, setNewTokenInfo] = useState<any>({})
  const [refreshTokenTriggered, setRefreshTokenTriggered] = useState<any>(false)
  const [hasRequiredPoap, setHasRequiredPoap] = useState<boolean>(false)
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false)

  useEffect(() => {
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', listInfo?.owner ?? '')
      const docSnap = await getDoc(usersRef)

      return { ...docSnap.data(), id: docSnap.id };
    }

    if (listInfo?.owner) {
      getUserInfo().then((result: any) => {
        setUser(result)
      })
    }
  }, [listInfo]);

  const getUserId = async (twitterUsername: string) => {
    console.log('get userId');
    const formattedUsername = removeAtSymbol(twitterUsername)

    setLoading(true)
    await fetch('/api/twitter/get-user-id',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: formattedUsername })
      })
      .then(response => {
        if (!response.ok) {
          console.log('response error', response);

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
      addUserToWaitlist()
    }
  }, [userInfo])

  const addUserToFirebaseList = async (id: string, data: any) => {
    console.log('addUserToFirebaseList', id);

    if (!id) return

    const { result, error } = await editData('lists', id, data)
    if (error) {
      return console.log('Add to firebase error', error)
    }
    return { result }
  }

  const hasUsername = (array: any[], username: string) => {
    return array.some(item => {
      const parts = item.split('/');
      return parts[1] === username;
    });
  };

  const checkIsUserInWaitlist = () => {
    const isRepeated = hasUsername(listInfo?.waitlist, userInfo?.id)
    if (isRepeated) {
      setError('You are on the waitlist. Please be patient');
    }

    setLoading(false);
    return isRepeated
  }

  const checkIsUserInMemberList = () => {
    const isRepeated = hasUsername(listInfo?.members, userInfo?.id)
    if (isRepeated) {
      setError('You are already on the members list');
    }

    setLoading(false);
    return isRepeated
  }

  useEffect(() => {
    if (newTokenInfo && !refreshTokenTriggered) {
      addUserToWaitlist()
    }
  }, [newTokenInfo])

  const addUserToWaitlist = () => {
    if (!userInfo?.id || !listInfo?.listId) {
      console.log('cant add to list', 'userInfo?.id', userInfo?.id, 'listInfo?.listId', listInfo?.listId);
      setLoading(false)
      return;
    }
    if (checkIsUserInWaitlist()) {
      console.log('user is already on the waitlist');

      setLoading(false)
      return;
    }

    if (checkIsUserInMemberList()) {
      console.log('user is already on the members list');

      setLoading(false)
      return;
    }
    const dataToUpdate = {
      waitlist: arrayUnion(`${choosenCollectibleToAssign?.data?.event?.id}-${choosenCollectibleToAssign?.data?.tokenId}/${userInfo?.id}`)
    };
    addUserToFirebaseList(listInfo.id, dataToUpdate);
    setLoading(false)
    setShowEnterUsername(false)
    setTwitterUsername('')
    setUserAddedToWaitlist(true);
  }

  //Get Required NFTs  DO NOT DELETE
  // useEffect(() => {
  //   const fetchRequiredNFTsData = async () => {
  //     await Promise.all(
  //       listInfo?.requiredNFTs.map(async (item: number) => {
  //         if (!requiredNFTs.some(existingItem => existingItem?.tokenId === item)) {
  //           const metadata: ResponseDto<NftTokenDetail | null> = await tatum.nft.getNftMetadata({
  //             tokenAddress: listInfo?.contractAddress,
  //             tokenId: item
  //           })
  //           setRequiredNFTs(oldArray => [...oldArray, metadata.data]);
  //         }
  //       })
  //     )
  //   }

  //   if (!listInfo?.isPoap && listInfo?.requiredNFTs > 0) {
  //     fetchRequiredNFTsData()
  //       .catch(console.error);
  //   }
  // }, [listInfo])

  //Get Required Poaps
  useEffect(() => {
    const getPoapsInfo = async () => {
      const results = await Promise.all(listInfo?.requiredPoaps?.map((item: any) => {
        const tokenId = item.split('-')
        return fetchPoapToken(tokenId[1])
      }));

      setRequiredPOAPs(results)
      setChoosenCollectibleToAssign(results[0])
    }

    if (listInfo?.requiredPoaps) {
      getPoapsInfo()
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

  const checkIfOwnRequiredPoap = (ownedPoaps: any[], requiredPoaps: any[]) => {
    const ownedTokenIds = ownedPoaps.map(poap => poap?.event?.id);
    return requiredPoaps?.some(requiredPoap => ownedTokenIds?.includes(requiredPoap?.data?.event?.id));
  };

  useEffect(() => {
    if (poaps && requiredPOAPs) {
      const hasRequiredPoapCheck = checkIfOwnRequiredPoap(poaps, requiredPOAPs);
      setHasRequiredPoap(hasRequiredPoapCheck)
    }
  }, [poaps, requiredPOAPs])

  if (userAddedToWaitlist) {
    return (
      <Layout>
        <div className='px-[16px] max-w-large flex items-center m-auto'>
          <Success
            title="You have been added to the list!"
            description={`Dont fomo, it can take a minute or two while you are added to the list`}
            firstButtonText="Open in X"
            firstButtonLink={`https://twitter.com/i/lists/${listInfo?.listId}`}
            firstButtonIcon={<Twitter className="m-auto" />}
            secondButtonText={shareLinkCopied ? "Link copied" : "Share"}
            secondButtonOnClick={() => {
              navigator.clipboard.writeText(`https://app.phoros.io/list/${listInfo?.listId}`)
              setShareLinkCopied(true)
            }}
            secondButtonIcon={<Share className="m-auto" />}
          />
        </div>
      </Layout>
    )
  }

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

            {listInfo &&
              <div className="flex justify-between gap-4 mt-[50px]">
                <CardButton
                  onClick={() => {
                    window.open(`https://twitter.com/i/lists/${listInfo?.listId}`, '_blank');
                  }}
                  title="Open in X"
                  icon={<Twitter className="m-auto" />}
                />
                <CardButton
                  disabled={loading}
                  onClick={() => {
                    if (address) {
                      if (hasRequiredPoap) {
                        setShowEnterUsername(true)
                      } else {

                      }
                    } else {
                      open({ view: 'Connect' })
                    }
                  }}
                  title={!address ? 'Log In' : hasRequiredPoap ? "Join List" : "You don't have the required collectible"}
                  icon={<AddUser className={`m-auto  ${hasRequiredPoap ? 'text-white' : ''}`} color={hasRequiredPoap ? "white" : "black"} />}
                  loading={loading}
                  className={`${hasRequiredPoap ? 'bg-[#22C55E] text-white' : 'bg-white text-black cursor-auto'}`}
                />
              </div>
            }
          </div>

          {error && <p className="text-xl text-red-500 mt-[15px]">{error}</p>}

          {userAddedToList &&
            <p className="text-xl text-[#22C55E]">You were added to the list</p>
          }

          {userAddedToWaitlist &&
            <p className="text-xl text-[#22C55E] mt-[15px]">You were added to the waitlist</p>
          }

          {!listInfo &&
            <p className="text-xl mt-[20px]">There are no lists for this event</p>
          }

          <div className="mt-[20px]">
            <h2 className="text-base font-bold mb-[5px]">Collectibles Required</h2>
            {/* {listInfo?.isPoap && <PoapItemContainer title={tokenData.name} image={tokenData.image_url} />} */}

            {listInfo?.isPoap && requiredPOAPs.length > 0 && requiredPOAPs.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PoapItemContainer title={item?.data?.event?.name} image={item?.data?.event?.image_url} />
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
                <h2 className="text-xl mb-[10px]">Enter your X (Twitter) handle to continue</h2>

                <button
                  className="ml-[10px]"
                  onClick={() => setShowEnterUsername(false)}
                >
                  Close
                </button>
              </div>
              <div className=''>

                <input
                  type='text'
                  id='username'
                  className='border border-gray-300 rounded-md p-2 w-full text-black'
                  placeholder='@elonmusk'
                  value={twitterUsername}
                  onChange={(event) => {
                    setTwitterUsername(event.target.value)
                  }}
                />
              </div>

              <Button
                disabled={twitterUsername == ''}
                onClick={() => {
                  getUserId(twitterUsername)
                }}
                className={`mt-[0] ${twitterUsername == '' ? 'bg-primary' : 'bg-[#91D1F8]'}`}
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