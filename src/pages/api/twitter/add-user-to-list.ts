//import TwitterApi from 'twitter-api-v2';
import TwitterApi from 'twitter-api-v2';

export default async function handler(req: any, res: any) {
  try {

    const userClient = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_KEY ?? '',
      appSecret: process.env.NEXT_PUBLIC_TWITTER_KEY_SECRET ?? '',
      accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '',
      accessSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? '',
    });

    // // Tell typescript it's a readonly app
    const readOnlyClient = userClient.readOnly;

    // Play with the built in methods
    const user = await readOnlyClient.v2.userByUsername('robertramdev');

    console.log('user', user);

    //const readWriteClient = userClient.readOnly;
    // const myNewList = await userClient.v2.createList({ name: 'cats', private: false });
    // console.log('myNewList', myNewList);
    //1710370688060547155

    const addListMember=await userClient.v2.addListMember('1710370688060547155', '1460684613119057930');
    console.log('addListMember', addListMember);

    // Forward the Twitter API response to your Next.js app
    res.status(200).json('hi');
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


