import { useState, useEffect } from 'react';
import useTatum from "@/hooks/useTatum";

const useFetchNFTBalance = (address: string) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const tatum = useTatum(); // Assuming useTatum is another custom hook

  useEffect(() => {
    const getNFTs = async () => {
      try {
        setLoading(true);
        const balance = await tatum?.nft?.getBalance({ addresses: [address] });
        setNFTs(balance.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
        tatum?.destroy(); // Assuming this is necessary for cleanup
      }
    };

    if (address) {
      getNFTs();
    }

    // Optional: Cleanup function if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, [address, tatum]); // Dependencies array

  return { nfts, loading, error };
};

export default useFetchNFTBalance;
