import { ThirdwebNftMedia, useActiveClaimConditionForWallet, useAddress, useContract, useValidDirectListings } from '@thirdweb-dev/react'
import { NFT as NFTProps } from '@thirdweb-dev/sdk'
import Link from 'next/link'
import EventCard from './EventCard'
import TicketCard from './TicketCard'
import { Loading } from './Loading'

interface Props {
  id?: any
  active?: boolean
  collectionAddress: string
  marketplaceAddress: string
  nft: NFTProps
  link?: string
  onClick?: () => void
  price?: string
}

export const NFT = ({ id, active, collectionAddress, marketplaceAddress, nft, link, onClick, price }: Props) => {
  const address = useAddress();
  const { contract, isLoading } = useContract(collectionAddress)

  // const { data: directListing, isLoading: loadingDirectListing } = useValidDirectListings(marketplace, {
  //   tokenContract: collectionAddress,
  //   tokenId: nft.metadata.id
  // })

  const { data: activeClaimCondition } = useActiveClaimConditionForWallet(
    contract,
    address,
    id
  );

  //console.log('activeClaimCondition', activeClaimCondition?.maxClaimablePerWallet);

  //if (loadingMarketplace || loadingDirectListing) return (<Loading />)

  return (
    <div className={`${active != undefined && active == id ? 'border-solid border-blue-600 border-2' : ''}`}>
      <TicketCard
        title={`${nft.metadata.name} #${nft.metadata.id}`}
        image={nft?.metadata.image ?? ''}
        //details={activeClaimCondition?.currencyMetadata?.displayValue ? `Price: ${activeClaimCondition?.currencyMetadata?.displayValue ?? ''} ${activeClaimCondition?.currencyMetadata?.symbol ?? ''}` : ''}
        //place={directListing && directListing[0] ? `${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}` : 'Not listed'}
        link={link ?? ''}
        onClick={onClick}
        details={price ? `Price: $${price}` : ''}
      //onClick={() => onClick && onClick(directListing[0]?.currencyValuePerToken.displayValue)}
      />
    </div>
  )

  // return (
  //   <div className='border-solid border-2 border-red-600 w-[200px]' >
  //     <Link className='border-solid border-2 border-red-600 '  onClick={onClick} href={link ?? ''}>
  //       <p>Token Id #{nft.metadata.id}</p>
  //       <p>{nft.metadata.name}</p>
  //       <img src={nft?.metadata.image ?? ''} className="w-full object-cover" />

  //       <div>
  //         {loadingMarketplace || loadingDirectListing ?
  //           (
  //             <div>...</div>
  //           ) : directListing && directListing[0] ?
  //             (
  //               <div>
  //                 <p>Price</p>
  //                 <p>{`${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}`}</p>
  //               </div>
  //             ) :
  //             (
  //               <div>
  //                 <p>Price</p>
  //                 <p>Not listed</p>
  //               </div>
  //             )
  //         }
  //       </div>
  //     </Link>
  //   </div>
  // )
}