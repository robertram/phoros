import { getDocuments, db } from "@/firebase/firestore/getData";
import { useEffect, useState } from 'react';
import { EventType } from '@/types/types'
import Button from '@/components/Button';
import Image from 'next/image'
import { getShortAddress, getIpfsURL } from "@/lib/utils";
import Link from "next/link";
import { usePaper } from '@/context/PaperContext';
import { Loading } from "./Loading";
import { NFT } from "@thirdweb-dev/sdk";
import { query, collection, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Modal from "./Modal";
import QRCode from 'qrcode'
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import Calendar from "@/icons/Calendar";
import moment from "moment";
import MapPin from "@/icons/MapPin";

interface TicketDetailsProps {
  contractAddress?: string
  tokenId?: string
  admin?: boolean
  nft: NFT;
  contractMetadata: any;
}

export const TicketDetails = ({ nft, contractMetadata, contractAddress, tokenId, admin }: TicketDetailsProps) => {
  const { address, connected } = usePaper();
  const [eventTicket, setEventTicket] = useState<EventType | undefined>()
  const [showQRModal, setShowQRModal] = useState<boolean>(false)
  const [QRCodeUrl, setQRCodeUrl] = useState('')

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

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(`${contractAddress}-${tokenId}-${address}`)
      console.log('response', response)
      setQRCodeUrl(response)
    } catch (e) {
      console.log('error', e)
    }
  }

  console.log('eventTicket', eventTicket);
  //const { data: nfts, isLoading, error } = useOwnedNFTs(contract, address);

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

          {connected &&
            <Button onClick={() => {
              generateQrCode()
              setShowQRModal(true)
            }}>
              Open QR Code
            </Button>
          }
        </div>
      </div>
    )
  }

  if (!nft) {
    return <Loading />
  }

  const ticketImage = nft?.metadata.image

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
                {/* <div >
                  <img
                    src={contractMetadata.image}
                    height="32px"
                    width="32px"
                  />
                </div> */}
                <Link className="text-xl hover:text-custom-purple underline" href={`/event/${eventTicket?.id}`}>{contractMetadata.name}</Link>
              </div>
            )}
          </div>

          <h1 className='text-3xl'>{nft?.metadata?.name} #{tokenId} </h1>
          <div className="mt-[20px]">
            {eventTicket?.location &&
              <div className="location flex mb-[5px]">
                <MapPin className="w-5 mr-2 " /> {eventTicket?.location}
              </div>
            }
            {eventTicket?.startDate &&
              <div className="date flex mb-[5px]">
                <Calendar className="w-5 mr-2 " /> {moment(eventTicket?.startDate).format('MMMM Do YYYY h:mm A')} - {moment(eventTicket?.endDate).format('h:mm A')}
              </div>
            }
            <AddToCalendarButton
              name={eventTicket?.name}
              startDate={moment(eventTicket?.startDate).format('YYYY-MM-DD')}
              endDate={moment(eventTicket?.startDate).format('YYYY-MM-DD')}
              startTime={moment(eventTicket?.startDate).format('HH:mm')}
              endTime={moment(eventTicket?.endDate).format('HH:mm')}
              timeZone={eventTicket?.timeZone}
              options={['Apple', 'Google', 'iCal']}
            ></AddToCalendarButton>
          </div>
          {/* <div className="flex">
            <p className="text-base">Owned by:</p>
            <Link
              href={`/profile/${nft?.owner}`}
            >
              <div className="flex">
                <img
                  src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                  height="32px"
                  width="32px"
                /> 
                <p >{nft?.owner.slice(0, 6)}...{nft?.owner.slice(-4)}</p>
              </div>
            </Link>
          </div> */}


          {/* <div>
            <p className="text-base">You own: {nft?.supply}</p>
          </div> */}

          {/* {(admin && eventTicket?.eventCreator && address && eventTicket?.eventCreator === address) ?
            <div className="">
              <Button >List ticket</Button>
            </div>
            : ''
          } */}

          <div className="md:hidden block">{nftDetails()}</div>

          <Modal show={showQRModal} onClose={() => setShowQRModal(false)}>
            <div>
              <img src={QRCodeUrl} alt="qr" className='w-[400px] h-[400px] m-auto' />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

