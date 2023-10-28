import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const name = req.body?.name
    const description = req.body?.description
    const isPrivate = req.body?.isPrivate ? req.body?.isPrivate : false

    if (name && description) {
      const userClient = new TwitterApi({
        appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
        appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '',
        accessSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? '',
      });

      const myNewList = await userClient.v2.createList({ name: name, description: description, private: isPrivate });
      console.log('myNewList', myNewList);

      res.status(200).json(myNewList);
    }
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


