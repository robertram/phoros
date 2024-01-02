import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import useFetchNFTBalance from './useFetchNFTBalance';
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection } from "firebase/firestore";
import usePoaps from './usePoaps';

const usePlans = () => {
  const { address } = useAccount()
  const { nfts, loading: nftsLoading } = useFetchNFTBalance(address ?? '');
  const [plans, setPlans] = useState<any>();
  const [eligibleForPlans, setEligibleForPlans] = useState<any>({});
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(address ?? ''); //example: '155843-6810632'

  const getAllData = async () => {
    const customQuery = query(collection(db, "plans"));
    return await getDocuments({ customQuery })
  }

  useEffect(() => {
    getAllData().then((result: any) => {
      setPlans(result.result)
    })
  }, []);

  const checkIfOwnRequiredPoap = (ownedPoaps: any[], requiredPoaps: any[], eligibility: any) => {
    const ownedTokenIds = ownedPoaps.map(poap => `${poap?.event?.id}`);
    const ownedPoapsIds = ownedPoaps.map(poap => `${poap?.event?.id}-${poap?.tokenId}`);

    if (eligibility === 'all') {
      // Check if you own all required NFTs
      const ownAllRequiredPoaps = requiredPoaps.every(requiredPoap => ownedPoapsIds.includes(requiredPoap));
      console.log('ownAllRequiredPoaps all of them', ownAllRequiredPoaps);
      return ownAllRequiredPoaps;
    } else {
      // Check if you own at least one required NFT
      const ownRequiredPoap = requiredPoaps.some(requiredPoap => ownedTokenIds.includes(requiredPoap.split('-')[0]));
      console.log('ownRequiredPoap at least one', ownRequiredPoap);
      return ownRequiredPoap;
    }
  };

  const checkIfOwnRequiredNFT = (ownedNFTs: any[], requiredNFTs: any[], eligibility: any) => {
    const ownedTokenAddresses = ownedNFTs.map(nft => nft?.tokenAddress);
    const ownedNFTIds = ownedNFTs.map(nft => `${nft?.tokenAddress}-${nft?.tokenId}`);

    if (eligibility === 'all') {
      // Check if you own all required NFTs
      const ownAllRequiredNFTs = requiredNFTs.every(tokenAddress => ownedNFTIds.includes(tokenAddress));
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
    if (nfts && poaps && plans) {
      const eligibility: any = {};
      plans.forEach((plan: any) => {
        let nftEligibilityCheck: boolean = false;
        if (plan?.requiredNFTs) {
          nftEligibilityCheck = checkIfOwnRequiredNFT(nfts, plan?.requiredNFTs, plan?.nftEligibility);
        }

        let poapEligibilityCheck: boolean = false;
        if (plan?.requiredPoaps) {
          poapEligibilityCheck = checkIfOwnRequiredPoap(poaps, plan?.requiredPoaps, plan?.poapEligibility);
        }

        eligibility[plan.name] = nftEligibilityCheck || poapEligibilityCheck;
      });
      setEligibleForPlans(eligibility);
    }
  }, [nfts, poaps, plans]);

  console.log('eligibleForPlans', eligibleForPlans);

  return { eligibleForPlans }
};

export default usePlans;
