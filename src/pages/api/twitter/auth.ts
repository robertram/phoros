//import TwitterApi from 'twitter-api-v2';
import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const client = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
      appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
    });

    const CALLBACK_URL = 'http://localhost:3000/'

    const authLink = await client.generateAuthLink('oob');
    
    res.status(200).json(authLink);
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


