import { ThirdwebNftMedia, useActiveClaimConditionForWallet, useAddress, useContract, useValidDirectListings } from '@thirdweb-dev/react'
import { NFT as NFTProps } from '@thirdweb-dev/sdk'
import Link from 'next/link'
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
        title={`${nft.metadata.name}`}
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
}