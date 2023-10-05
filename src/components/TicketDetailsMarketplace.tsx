import { getDocuments, db, getDocument } from "@/firebase/firestore/getData";
import { useEffect, useState } from 'react';
import { EventType } from '@/types/types'
import Button from '@/components/Button';
import { Table } from "@/components/Table";
import Image from 'next/image'
import { getShortAddress, getIpfsURL } from "@/lib/utils";
import Link from "next/link";
import { useContract, useNFT, useDirectListing, useNFTBalance, useValidDirectListings, useValidEnglishAuctions, } from '@thirdweb-dev/react';
import { usePaper } from '@/context/PaperContext';
import { CheckoutWithCard } from '@paperxyz/react-client-sdk';
import { UserStatus } from '@paperxyz/embedded-wallet-service-sdk';
import Modal from '@/components/Modal';
import { Loading } from "./Loading";
import { BigNumber } from "ethers";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { getFirestore, doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { useRouter } from "next/router";

interface TicketDetailsProps {
  contractAddress?: string
  tokenId?: string
  admin?: boolean
  nft: NFT;
  contractMetadata: any;
}

export const TicketDetailsMarketplace = ({ nft, contractMetadata, contractAddress, tokenId, admin }: TicketDetailsProps) => {
  const router = useRouter();
  const { address, email } = usePaper();
  const [eventTicket, setEventTicket] = useState<EventType | undefined>()
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false)
  const [buyButtonLoading, setBuyButtonLoading] = useState<boolean>(false)

  useEffect(() => {
    if (buyButtonLoading) {
      setTimeout(() => {
        setBuyButtonLoading(false)
        router.push('/account')
      }, 4000);
    }
  }, [buyButtonLoading])

  // useEffect(() => {
  //   if (!eventId) return
  //   const getData = async () => {
  //     return await getDocument('events', eventId)
  //   }
  //   getData().then((result: any) => {
  //     console.log('result', result);

  //     setEventTicket(result.result._document?.data.value.mapValue.fields)
  //   })
  // }, [eventId]);

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "events"), where("contractAddress", "==", contractAddress));
      return await getDocuments({ customQuery })
    }

    if (address) {
      getAllData().then((result: any) => {
        setEventTicket(result.result[0])
      })
    }
  }, [address]);

  console.log('eventTicket', eventTicket);

  const { contract } = useContract(eventTicket?.contractAddress);
  //const { data: nft, isLoading, error }: any = useNFT(contract, tokenId);

  const { contract: marketplaceContract } = useContract(eventTicket?.marketplaceAddress, 'marketplace-v3')
  const { data: nftListing } = useDirectListing(marketplaceContract, tokenId)

  const { data: nftBalance } = useNFTBalance(
    contract,
    address,
    tokenId,
  );

  const { data: directListing, isLoading: loadingDirectListing } =
    useValidDirectListings(marketplaceContract, {
      tokenContract: eventTicket?.contractAddress,
      tokenId: nft?.metadata.id,
    });

  const { data: auctionListing, isLoading: loadingAuction }: any =
    useValidEnglishAuctions(marketplaceContract, {
      tokenContract: eventTicket?.contractAddress,
      tokenId: nft?.metadata.id,
    });

  async function buyListing() {
    let txResult;

    //Add for auction section
    if (auctionListing?.[0]) {
      txResult = await marketplaceContract?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      );
    } else if (directListing?.[0]) {
      txResult = await marketplaceContract?.directListings.buyFromListing(
        directListing[0].id,
        1
      );
    } else {
      throw new Error("No listing found");
    }

    return txResult;
  }

  const nftDetails = () => {
    return (
      <div className="mt-[10px]">
        <div>
          <div className="mt-[10px]">
            <h3 className="text-2xl">Contract</h3>
            <p> {eventTicket?.contractAddress && getShortAddress(eventTicket?.contractAddress)}</p>
          </div>

          {nft?.metadata.description &&
            <div className="mt-[10px]">
              <h3 className="text-2xl">Description</h3>
              <p>{nft?.metadata.description}</p>
            </div>
          }
          {nft?.metadata.attributes &&
            <div className="mt-[10px]">
              <h3 className="text-2xl mb-[5px]">Traits</h3>
              {Object.entries(nft?.metadata?.attributes || {}).map(
                ([key, value]: any) => (
                  <div className="border-2 border-solid border-gray-400 max-w-[200px] p-2 rounded-lg" key={key}>
                    <p className="text-base">{value.trait_type}</p>
                    <p className="text-lg">{value.value}</p>
                  </div>
                )
              )}
            </div>
          }
        </div>
      </div>
    )
  }

  if (!nftListing) {
    return <Loading />
  }

  const ticketImage = nftListing?.quantity !== '0' ? nftListing?.asset.image : nft?.metadata.image

  //min-h-[300px] md:min-h-[300px] max-h-[500px]

  //md:h-[600px]

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 mr-[50px]">
          <div className="left p-[20px] h-[auto]  rounded-md md:mb-[30px] border-solid border-[1px] flex border-[rgb(229, 232, 235)]" >
            <div className="relative h-full w-full min-h-[300px] md:min-h-[300px] max-h-[500px] my-auto">
              {ticketImage &&
                <Image
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  src={getIpfsURL(ticketImage)} alt={`${nft?.metadata.name}`}
                />
              }
            </div>
          </div>

          <div className="md:block hidden">{nftDetails()}</div>

        </div>

        <div className="right w-full md:w-1/2 mt-[20px]">
          <div className="flex">
            {contractMetadata && (
              <div className="flex" >
                <div >
                  <img
                    src={contractMetadata.image}
                    height="32px"
                    width="32px"
                  />
                </div>
                <Link className="text-xl hover:text-custom-purple underline" href={`/event/${eventTicket?.id}`}>{contractMetadata.name}</Link>
              </div>
            )}
          </div>

          <h1 className='text-3xl'>{eventTicket?.name} #{tokenId} </h1>
          <div className="flex">

            <p className="text-base">Owned by:</p>
            <Link
              href={`/profile/${nft?.owner}`}

            >
              <div className="flex">
                <img
                  src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                  height="32px"
                  width="32px"
                //h={"24px"} w={"24px"} mr={"10px"} 
                />
                <p >{nft?.owner.slice(0, 6)}...{nft?.owner.slice(-4)}</p>
              </div>
            </Link>
          </div>

          {/* {nftListing?.quantity !== '0' ?
            <div className="border-2 border-solid border-gray-300 rounded-lg p-4 mt-[10px] flex justify-between">
              <div className="mr-[10px]">
                <h3 className="text-3xl">Price</h3>
                <p>{nftListing?.currencyValuePerToken?.displayValue} {nftListing?.currencyValuePerToken?.symbol}</p>
              </div>
              <Button className="w-min whitespace-nowrap !my-auto"
                onClick={() => {
                  setShowBuyModal(true)
                }}
              >Buy Now</Button>
            </div>
            :
            <div className="border-2 border-solid border-gray-300 rounded-lg p-4 mt-[10px] flex justify-between">
              <div className="mr-[10px]">
                <h3 className="text-3xl">Sold Out</h3>
              </div>
            </div>
          } */}

          <div className="border-2 border-solid border-gray-300 rounded-lg p-4 mt-[10px] flex justify-between">
           
            {directListing &&
              <div className="my-auto">
                {directListing && directListing[0] ? (
                  <div>
                     <p className="text-3xl">Price:</p>
                    <p className="my-auto">
                      {directListing[0]?.currencyValuePerToken.displayValue}
                      {" " + directListing[0]?.currencyValuePerToken.symbol}
                    </p>

                    <div className="flex">
                      <Button
                        className="mr-2 whitespace-nowrap"
                        onClick={async () => {
                          buyListing()
                          setBuyButtonLoading(true)
                        }}
                      > {buyButtonLoading ? 'Buying...' : 'Buy at asking price'}</Button>
                      <Button
                      className="whitespace-nowrap"
                        //className="w-min whitespace-nowrap !my-auto"
                        onClick={() => {
                          setShowBuyModal(true)
                        }}
                      >Buy with Debit/Credit Card</Button>
                    </div>
                  </div>
                ) : (
                  <p className="my-auto">Not for sale</p>
                )}
              </div>
            }
          </div>
          <div >

          </div>



          {/* {(admin && eventTicket?.eventCreator && address && eventTicket?.eventCreator === address) ?
            <div className="">
              <Button >List ticket</Button>
            </div>
            : ''
          } */}

          <div className="md:hidden block">{nftDetails()}</div>

          {/* <div className="mt-[20px]">
            <h2 className="text-2xl mb-[10px]">Offers</h2>
            <Table />
          </div> */}

          <Modal
            show={showBuyModal}
            setShow={() => {
              setShowBuyModal(!showBuyModal)
            }}
          >
            <div className='p-[20px]'>
              <h2 className='font-bold text-2xl leading-7 mb-[10px]'>
                {`Buy your ticket to ${eventTicket?.name}`}
              </h2>

              {address &&
                <CheckoutWithCard
                  configs={{
                    contractId: eventTicket?.marketplaceId,
                    walletAddress: address,
                    quantity: 1,
                    email: email,
                    contractArgs: {
                      listingId: nftListing?.id
                    }
                  }}
                  onPaymentSuccess={() => { console.log('success') }}
                  onReview={(result) => console.log('onReview', result)}
                  options={{
                    colorBackground: '#ffffff',
                    colorPrimary: '#99e0ff',
                    colorText: '#363636',
                    borderRadius: 6,
                    inputBackgroundColor: '#ffffff',
                    inputBorderColor: '#b0b0b0',
                  }}
                />
              }
              <button
                className='mt-[20px] w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple'
                onClick={() => {
                  setShowBuyModal(false)
                  //router.push('/account')
                }}
              >
                Ok
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

