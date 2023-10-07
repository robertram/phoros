import { useState, useEffect } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';

const useAlchemy = (activeChain: any) => {
  const [alchemyInstance, setAlchemyInstance] = useState<any>(null);

  useEffect(() => {
    const initializeAlchemy = async () => {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
        network: Network.MATIC_MUMBAI,
      };

      const alchemy: any = new Alchemy(settings);

      setAlchemyInstance(alchemy);
    };

    initializeAlchemy();
  }, [activeChain]);

  return alchemyInstance;
};

export default useAlchemy;
