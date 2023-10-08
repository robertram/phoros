//import TwitterApi from 'twitter-api-v2';
import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const listId = req.body?.listId
    const userId = req.body?.userId

    const userClient = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
      appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
      accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '',
      accessSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? '',
    });

    console.log('listId', listId);
    console.log('userId', userId);
    
    const addListMember = await userClient.v2.addListMember(listId, userId);
    console.log('addListMember', addListMember);

    res.status(200).json(addListMember);
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


