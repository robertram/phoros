import TwitterApi from 'twitter-api-v2';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';

const updateUserInfo = async (accessToken: string, refreshToken: string, expireTime: number, address: string) => {
  const usersRef = doc(db, 'users', address ?? '')

  try {
    await setDoc(usersRef, { accessToken, refreshToken, expireTime }, { merge: true })
  } catch (err) {
    console.error('You dont have permission')
  }
}

export default async function handler(req: any, res: any) {
  try {
    const id = req.body?.id
    const refreshToken = req.body?.refreshToken

    if (refreshToken) {
      const client = new TwitterApi({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
      });

      const { client: refreshedClient, accessToken, refreshToken: newRefreshToken, expiresIn } =
        await client.refreshOAuth2Token(refreshToken);

      const expireTime = Date.now() + (expiresIn * 1000);

      updateUserInfo(accessToken, newRefreshToken ?? '', expireTime, id)

      res.status(200).json({ accessToken });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error('Refresh Token Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


