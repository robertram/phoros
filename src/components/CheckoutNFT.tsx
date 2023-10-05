import { useActiveClaimConditionForWallet, useAddress, useClaimConditions, useContract, useValidDirectListings } from '@thirdweb-dev/react'
import { NFT as NFTProps } from '@thirdweb-dev/sdk'
import CryptoCheckout from './CryptoCheckout'
import EventCard from './EventCard'
import { Loading } from './Loading'

interface Props {
  id?: any
  active?: boolean
  collectionAddress: string
  marketplaceAddress: string
  nft: NFTProps
  link?: string
  onClick?: () => void
  eventData: any
  onSuccess?: () => void
}

export const CheckoutNFT = ({ id, active, collectionAddress, marketplaceAddress, nft, link, onClick, eventData, onSuccess }: Props) => {
  const { contract } = useContract(collectionAddress);
  const address = useAddress();
  const { data: activeClaimCondition } = useActiveClaimConditionForWallet(
    contract,
    address,
    id
  );

  const isFree = activeClaimCondition?.currencyMetadata.displayValue == '0.0' ? true : false

  if (!nft) {
    return <Loading />
  }

  return (
    <div>
      <EventCard
        title={`${nft.metadata.name} #${nft.metadata.id}`}
        image={nft?.metadata.image ?? ''}
        place={isFree ? 'Free' : activeClaimCondition?.currencyMetadata.displayValue}
        link={link ?? ''}
        onClick={onClick}
      />
      <CryptoCheckout contractAddress={eventData?.contractAddress.stringValue} tokenId={id} onSuccess={onSuccess} />
    </div>
  )
}