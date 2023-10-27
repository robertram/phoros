import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const username = req.body?.username

    const userClient = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
      appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
      accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '',
      accessSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? '',
    });

    const userInfo = await userClient.v2.userByUsername(username);
    
    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


