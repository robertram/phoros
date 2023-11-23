import useNFTMetadata from "@/hooks/useNFTMetadata";
import { TokenItemContainer } from "@/components/TokenItemContainer";

interface RequiredNFTsProps {
  tokenAddress: string
  tokenId: string
}

export const RequiredNFTs = ({ tokenAddress, tokenId }: RequiredNFTsProps) => {
  const { nft, loading: nftMetadataLoading } = useNFTMetadata(tokenAddress ?? '', tokenId ?? '');
  return (
    <div>
      <TokenItemContainer title={nft?.metadata?.name} image={nft?.metadata.image} />
    </div>
  )
}