import { useState, useEffect } from 'react';
import useTatum from "@/hooks/useTatum";
import { NftTokenDetail, ResponseDto } from '@tatumio/tatum';

const useNFTMetadata = (tokenAddress: string, tokenId: string) => {
  const [nft, setNFT] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const tatum = useTatum();

  useEffect(() => {
    const getNFTs = async () => {
      try {
        setLoading(true);
        const metadata: ResponseDto<NftTokenDetail | null> = await tatum.nft.getNftMetadata({
          tokenAddress: tokenAddress, // replace with your collection
          tokenId: tokenId
        })

        setNFT(metadata.data);
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        tatum.destroy();
        setLoading(false);
      }
    };

    if (tokenAddress && tokenId) {
      getNFTs();
    }
  }, [tokenAddress, tokenId, tatum]);

  return { nft, loading, error };
};

export default useNFTMetadata;