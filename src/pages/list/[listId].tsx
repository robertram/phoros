import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where, arrayUnion } from "firebase/firestore";
import Modal from "@/components/Modal";
import editData from "@/firebase/firestore/editData";
import { generateSocialLinks, limitStringTo200Characters, removeAtSymbol } from "@/utils/utils";
import { CardButton } from "@/components/CardButton";
import AddUser from "@/icons/AddUser";
import Twitter from "@/icons/Twitter";
import Edit from '@/icons/Edit';
import { TokenItemContainer } from "@/components/TokenItemContainer";
import { Loading } from "@/components/Loading";
import { fetchPoapToken } from "@/utils/poap";
import usePoaps from "@/hooks/usePoaps";
import { useAuth } from "@/context/AuthContext";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Success } from "@/components/Success";
import Share from "@/icons/Share";
import { RequiredNFTs } from "@/components/RequiredNFTs";
import useFetchNFTBalance from "@/hooks/useFetchNFTBalance";
import { SocialsButtons } from "@/components/SocialsButtons";
import { ListCreator } from "@/components/ListCreator";

export default function Community() {
  const { address } = useAuth()
  const { open, close } = useWeb3Modal()
  const router = useRouter();
  const listId = Array.isArray(router.query.listId) ? router.query.listId[1] : router.query.listId;
  const [loading, setLoading] = useState(false);
  const [userAddedToWaitlist, setUserAddedToWaitlist] = useState(false);

  const [userInfo, setUserInfo] = useState<any>({});
  const [listInfo, setListInfo] = useState<any>();

  const [showEnterUsername, setShowEnterUsername] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [addToListError, setAddToListError] = useState(false)
  const [error, setError] = useState('')
  const [requiredPOAPs, setRequiredPOAPs] = useState<any[]>([]);
  const [choosenCollectibleToAssign, setChoosenCollectibleToAssign] = useState<any>({});

  const [hasRequiredPoap, setHasRequiredPoap] = useState<boolean>(false)
  const [hasRequiredNFTs, setHasRequiredNFTs] = useState<boolean>(false)
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false)
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(address ?? '');
  const { nfts, loading: nftsLoading } = useFetchNFTBalance(address ?? '');

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
    return array?.some(item => {
      const parts = item?.split('/');
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
      waitlist: arrayUnion(userInfo?.id)
      //arrayUnion(`${choosenCollectibleToAssign?.data?.event?.id}-${choosenCollectibleToAssign?.data?.tokenId}/${userInfo?.id}`)
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
      //setChoosenCollectibleToAssign(results[0])
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
    
    if (listInfo?.eligibility === 'all') {
      // Check if you own all required NFTs
      const ownAllRequiredPoaps = requiredPoaps.every(requiredPoap => ownedTokenIds.includes(requiredPoap?.data?.event?.id));
      console.log('ownAllRequiredPoaps all of them', ownAllRequiredPoaps);
      return ownAllRequiredPoaps;
    } else {
      // Check if you own at least one required NFT
      const ownRequiredPoap = requiredPoaps.some(requiredPoap => ownedTokenIds.includes(requiredPoap?.data?.event?.id));
      console.log('ownRequiredPoap at least one', ownRequiredPoap);
      return ownRequiredPoap;
    }
  };

  useEffect(() => {
    if (poaps && requiredPOAPs) {
      const hasRequiredPoapCheck = checkIfOwnRequiredPoap(poaps, requiredPOAPs);
      setHasRequiredPoap(hasRequiredPoapCheck)
    }
  }, [poaps, requiredPOAPs])

  // const checkIfOwnRequiredNFT = (ownedNFTs: any[], requiredNFTs: any[]) => {
  //   const ownedTokenIds = ownedNFTs.map(nft => nft?.tokenAddress);
  //   return requiredNFTs?.some(requiredNFT => {
  //     const splittedString = requiredNFT.split('-')
  //     const tokenAddress = splittedString[0]
  //     return ownedTokenIds?.includes(tokenAddress)
  //   });
  // };

  const checkIfOwnRequiredNFT = (ownedNFTs: any[], requiredNFTs: any[]) => {
    const ownedTokenAddresses = ownedNFTs.map(nft => nft?.tokenAddress);

    if (listInfo?.eligibility === 'all') {
      // Check if you own all required NFTs
      const requiredTokenAddresses = requiredNFTs.map(requiredNFT => {
        const splittedString = requiredNFT.split('-');
        return splittedString[0];
      });

      const ownAllRequiredNFTs = requiredTokenAddresses.every(tokenAddress => ownedTokenAddresses.includes(tokenAddress));
      console.log('ownAllRequiredNFTs all of them', ownAllRequiredNFTs);
      return ownAllRequiredNFTs;
    } else {
      // Check if you own at least one required NFT
      const ownRequiredNFT = requiredNFTs.some(requiredNFT => {
        const splittedString = requiredNFT.split('-');
        const tokenAddress = splittedString[0];
        return ownedTokenAddresses.includes(tokenAddress);
      });
      console.log('ownRequiredNFT at least one', ownRequiredNFT);
      return ownRequiredNFT;
    }
  };

  useEffect(() => {
    if (nfts && listInfo?.requiredNFTs) {
      const hasRequiredNFTsCheck = checkIfOwnRequiredNFT(nfts, listInfo?.requiredNFTs);
      setHasRequiredNFTs(hasRequiredNFTsCheck)
    }
  }, [nfts, listInfo?.requiredNFTs])

  useEffect(() => {
    if (listInfo) {
      const newSocialLinks = generateSocialLinks(listInfo, socialLinks);

      if (newSocialLinks.length > 0) {
        setSocialLinks(prevLinks => [...prevLinks, ...newSocialLinks]);
      }
    }
  }, [listInfo, socialLinks]);

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
                <div className="flex w-full m-auto justify-center pt-[10px]">
                  <h1 className="text-3xl text-center ">{listInfo?.name}</h1>
                  {listInfo.owner === address &&
                    <a href={`/list/${listInfo.listId}/edit`} className="my-auto ml-[5px]">
                      <Edit className="" color="" />
                    </a>
                  }
                </div>
                <p className="text-base mt-[10px]">{limitStringTo200Characters(listInfo?.description)}</p>
                <ListCreator id={listInfo?.owner} />
              </div>
              :
              <div className="w-full flex justify-center">
                <Loading />
              </div>
            }

            {(hasRequiredPoap || hasRequiredNFTs) &&
              <SocialsButtons socialLinks={socialLinks} />
            }

            {listInfo &&
              <div className="flex justify-between gap-4">
                <CardButton
                  onClick={() => {
                    window.open(`https://twitter.com/i/lists/${listInfo?.listId}`, '_blank');
                  }}
                  title="Go to list"
                  icon={<Twitter className="m-auto" />}
                />
                <CardButton
                  disabled={loading}
                  onClick={() => {
                    if (address) {
                      if (hasRequiredPoap || hasRequiredNFTs) {
                        setShowEnterUsername(true)
                      } else {

                      }
                    } else {
                      open({ view: 'Connect' })
                    }
                  }}
                  title={!address ? 'Log In' : hasRequiredPoap || hasRequiredNFTs ? "Join List" : "You don't have the required collectible"}
                  icon={<AddUser className={`m-auto ${hasRequiredPoap || hasRequiredNFTs ? 'text-white' : ''}`} color={hasRequiredPoap || hasRequiredNFTs ? "white" : "black"} />}
                  loading={loading}
                  className={`${hasRequiredPoap || hasRequiredNFTs ? '!bg-[#22C55E] text-white' : 'bg-white text-black cursor-auto'}`}
                />
              </div>
            }
          </div>

          {error && <p className="text-xl text-red-500 mt-[15px]">{error}</p>}

          {userAddedToWaitlist &&
            <p className="text-xl text-[#22C55E] mt-[15px]">You were added to the waitlist</p>
          }

          {!listInfo &&
            <p className="text-xl mt-[20px]">There are no lists for this event</p>
          }

          <div className="mt-[20px]">
            <div className="flex mb-[10px]">
              <h2 className="text-base font-bold my-auto mr-[10px]">Collectibles Required</h2>

              <div className="bg-[#1717171a] rounded-[50px] text-[#737373] py-[4px] px-[8px]">
                {listInfo?.eligibility == 'one' ? 'At least one' : 'All of them'}
              </div>
            </div>
            {/* {listInfo?.isPoap && <PoapItemContainer title={tokenData.name} image={tokenData.image_url} />} */}

            {requiredPOAPs.length > 0 && requiredPOAPs.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <TokenItemContainer title={item?.data?.event?.name} image={item?.data?.event?.image_url} />
                </div>
              )
            })}

            {listInfo?.requiredNFTs?.length > 0 && listInfo?.requiredNFTs.map((item: any, index: number) => {
              const splittedString = item.split('-')
              const tokenAddress = splittedString[0]
              const tokenId = splittedString[1]

              return (
                <div key={index}>
                  <RequiredNFTs tokenAddress={tokenAddress} tokenId={tokenId} />
                  {/* <TokenItemContainer title={item?.metadata?.name} image={image} /> */}
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
                className={`mt-[10px] ${twitterUsername == '' ? 'bg-primary' : 'bg-[#91D1F8]'}`}
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