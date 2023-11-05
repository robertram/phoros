import { useState, useEffect } from 'react';

const usePoaps = (address: string) => {
  const [poaps, setPoaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      console.log('No address provided to usePoaps');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.poap.tech/actions/scan/${address}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': `${process.env.NEXT_PUBLIC_POAP_API_KEY}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPoaps(data);
      } catch (err: any) {
        console.error('Failed to fetch POAPs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]); // Only re-run the effect if the address changes

  return { poaps, loading, error };
};

export default usePoaps;
