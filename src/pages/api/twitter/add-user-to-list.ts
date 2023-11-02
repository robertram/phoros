import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    //New Member info
    const listId = req.body?.listId
    const userId = req.body?.userId
    //Twitter Access
    const accessToken = req.body?.accessToken
    const expireTime = req.body?.expireTime

    console.log('req.body', req.body);
    console.log(expireTime, 'Token expired', Date.now() > expireTime);

    if (!expireTime || Date.now() > expireTime) {
      return res.status(401).json({ error: 'Access token expired' });
    }

    if (listId && userId && accessToken) {
      const twitterClient = new TwitterApi(accessToken);
      const userClient = twitterClient.readWrite;

      console.log('userClient', userClient);
      

      const addListMember = await userClient.v2.addListMember(listId, userId);
      console.log('addListMember', addListMember);

      res.status(200).json(addListMember);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


