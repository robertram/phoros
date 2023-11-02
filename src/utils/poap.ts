export const fetchPoapToken = async (tokenId:string) => {
  try {
    const response = await fetch(`https://api.poap.tech/token/${tokenId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.NEXT_PUBLIC_POAP_API_KEY}`
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('data', data);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching POAPs:', error);
    return { data: null, error };
  }
};