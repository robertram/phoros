import { useState, useEffect } from 'react';
//import { Network, Alchemy } from 'alchemy-sdk';
import { TatumSDK, Network, Ethereum, ApiVersion } from '@tatumio/tatum'
import { chainIdMapping, getChainName } from '@/utils/tatum';
import { useNetwork } from 'wagmi';

const useTatum = () => {
  const { chain } = useNetwork()
  const [tatum, setTatumInstance] = useState<any>(null);

  const chainName = getChainName(chain?.id ?? 1)

  useEffect(() => {
    const initializeAlchemy = async () => {
      const tatum = await TatumSDK.init<Ethereum>({
        network: chainName,
        version: ApiVersion.V4,
        apiKey: {
          v4: process.env.NEXT_PUBLIC_TATUM_KEY,
        },
      })

      setTatumInstance(tatum);
    };

    initializeAlchemy();
  }, []);

  return tatum;
};

export default useTatum;
