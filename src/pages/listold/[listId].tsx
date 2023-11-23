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
import { TokenItemContainer } from "@/components/TokenItemContainer";
import { Loading } from "@/components/Loading";
import { ResponseDto, NftTokenDetail } from '@tatumio/tatum'
import useTatum from "@/hooks/useTatum";
import { doc, getDoc } from 'firebase/firestore';
import { fetchPoapToken } from "@/utils/poap";

export default function Community() {
  const tatum = useTatum()
  const router = useRouter();
  const tokenId = Array.isArray(router.query.tokenId) ? router.query.tokenId[1] : router.query.tokenId;
  const listId = Array.isArray(router.query.listId) ? router.query.listId[1] : router.query.listId;
  //const eventId = Array.isArray(router.query.eventId) ? router.query.eventId[1] : router.query.eventId;
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
  const [user, setUser] = useState<any>()

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
      addUserToList2()
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
    const response = await fetch('/api/twitter/add-user-to-list', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userInfo?.id, listId: listInfo?.listId, ...user })
    });
    return response
  }

  const addUserToList2 = async () => {
    setLoading(true);
    try {
      if (!userInfo?.id || !listInfo?.listId) {
        console.log('cant add to list', 'userInfo?.id', userInfo?.id, 'listInfo?.listId', listInfo?.listId);
        return;
      }

      console.log('userInfo', userInfo);
      console.log('listInfo?.waitlist', listInfo?.waitlist);

      const isRepeated = listInfo?.waitlist?.includes(userInfo?.id);

      if (isRepeated) {
        setError('You are still on the waitlist');
        setLoading(false);
        return;
      }

      let response = await addUserToList()

      console.log('response addUserToList', response);

      if (response.status === 401) {
        console.log('token might be expired');

        // Access token might be expired, try to refresh it

        console.log(401, 'user', user);

        const refreshResponse = await fetch('/api/twitter/refresh-token', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...user, refreshToken: user?.refreshToken })
        });

        if (!refreshResponse.ok) {
          console.log('failed to refresh token');
          throw new Error('Failed to refresh token');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        const newExpireTime = refreshData.expireIn;

        // Retry the original request with the new access token
        response = await fetch('/api/twitter/add-user-to-list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userInfo?.id, listId: listInfo?.listId, accessToken: newAccessToken, expireTime: newExpireTime })
        });
      }

      if (!response.ok) {
        console.log('response not ok', response);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const dataToUpdate = {
        members: arrayUnion(userInfo?.id)
      };
      addUserToFirebaseList(listInfo.id, dataToUpdate);
      setUserAddedToList(true);
      setLoading(false);
      setTwitterUsername('');
    }
    catch (err) {
      console.error('Error adding user to list:', err);
      const dataToUpdate = {
        waitlist: arrayUnion(userInfo?.id)
      };
      addUserToFirebaseList(listInfo.id, dataToUpdate);
      setError('Failed to add user to list');
      setUserAddedToList(false);
      setLoading(false);
      setTwitterUsername('');
    }

    if (listId) {
      getAllData().then((result) => {
        setListInfo(result.result[0]);
      });
    }
    setLoading(false);
  }

  //Get Required NFTs
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

    if (!listInfo?.isPoap && listInfo?.requiredNFTs > 0) {
      fetchRequiredNFTsData()
        .catch(console.error);
    }
  }, [listInfo])

  //Get Required Poaps
  useEffect(() => {
    const getPoapsInfo = async () => {
      const results = await Promise.all(listInfo?.requiredPoaps.map((item: any) => {
        const tokenId = item.split('-')
        return fetchPoapToken(tokenId[1])
      }));

      setRequiredPOAPs(results)
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
                  onClick={() => setShowEnterUsername(true)}
                  title="Join List"
                  icon={<AddUser className="m-auto" />}
                  loading={loading}
                />
              </div>
            }
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

            {listInfo?.isPoap && requiredPOAPs.length > 0 && requiredPOAPs.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <TokenItemContainer title={item?.data?.event?.name} image={item?.data?.event?.image_url} />
                </div>
              )
            })}

            {requiredNFTs.length > 0 && requiredNFTs.map((item: any, index: number) => {
              const image = item?.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");

              return (
                <div key={index}>
                  <TokenItemContainer title={item?.metadata?.name} image={image} />
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