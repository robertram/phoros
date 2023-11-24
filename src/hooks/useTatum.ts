import { useState, useEffect } from 'react';
import { TatumSDK, Network, Ethereum, ApiVersion } from '@tatumio/tatum'
import { chainIdMapping, getChainName } from '@/utils/tatum';
import { useNetwork } from 'wagmi';

const useTatum = () => {
  const { chain } = useNetwork()
  const [tatum, setTatumInstance] = useState<any>(null);

  const chainName = getChainName(chain?.id ?? 1)

  useEffect(() => {
    const initializeTatum = async () => {
      const tatum = await TatumSDK.init<Ethereum>({
        network: chainName,
        version: ApiVersion.V4,
        apiKey: {
          v4: process.env.NEXT_PUBLIC_TATUM_KEY,
        },
      })

      setTatumInstance(tatum);
    };

    initializeTatum();
  }, []);

  return tatum;
};

export default useTatum;
