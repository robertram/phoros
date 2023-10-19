import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const name = req.body?.name
    const description = req.body?.description
    const isPrivate = req.body?.isPrivate ? req.body?.isPrivate : false
    const oauth_token = req.body?.oauth_token
    const oauth_token_secret = req.body?.oauth_token_secret
    const oauth_pin = req.body?.oauth_pin

    if (name && description) {
      const userClient = new TwitterApi({
        appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
        appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
        accessToken: oauth_token ?? '',
        accessSecret: oauth_token_secret ?? '',
      });

      // Give the PIN to client.login()
      const { client: loggedClient, accessToken, accessSecret, screenName, userId } = await userClient.login(oauth_pin);

      console.log('screenName, userId!!', screenName, userId);

      const tempClient = new TwitterApi({
        appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
        appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
        accessToken: accessToken ?? '',
        accessSecret: accessSecret ?? '',
      });

      const myNewList = await tempClient.v2.createList({ name: name, description: description, private: isPrivate });

      console.log('myNewList', myNewList);

      res.status(200).json('myNewList');
    }
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


