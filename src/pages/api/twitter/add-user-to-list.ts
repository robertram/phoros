//import TwitterApi from 'twitter-api-v2';
import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {
    const listId = req.body?.listId
    const userId = req.body?.userId
    const accessToken = req.body?.accessToken

    console.log('listId', listId);
    console.log('userId', userId);
    console.log('accessToken', accessToken);

    if (listId && userId && accessToken) {
      const twitterClient = new TwitterApi(accessToken);
      const userClient = twitterClient.readWrite;

      // console.log('listId', listId);
      // console.log('userId', userId);
      // console.log('accessToken', accessToken);

      const addListMember = await userClient.v2.addListMember(listId, userId);
      console.log('addListMember', addListMember);

      res.status(200).json(addListMember);
    }
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


