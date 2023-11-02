import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    console.log('req.body', req.body);
    
    const name = req.body?.name
    const description = req.body?.description
    const isPrivate = req.body?.isPrivate || false
    const accessToken = req.body?.accessToken
    const expireTime = req.body?.expireTime

    if (Date.now() > expireTime) {
      return res.status(401).json({ error: 'Access token expired' });
    }

    if (name && description) {
      const twitterClient = new TwitterApi(accessToken);
      const userClient = twitterClient.readWrite;

      console.log('twitterClient', twitterClient);

      const myNewList = await userClient.v2.createList({ name: name, description: description, private: isPrivate });
      console.log('myNewList', myNewList);

      res.status(200).json(myNewList);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


