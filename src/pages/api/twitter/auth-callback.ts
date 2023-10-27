import TwitterApi from 'twitter-api-v2';
import { withSessionRoute } from '../../../lib/session'
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

const handler = async (req: any, res: any) => {
  try {
    const code = req.body?.code
    const address = req.body?.address
    const { codeVerifier, state: sessionState } = req.session;

    if (code) {
      const client = new TwitterApi({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
      });

      try {
        const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
          code,
          codeVerifier,
          redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL ?? ''
        });

        const { data: userObject } = await loggedClient.v2.me();

        const expireTime = Date.now() + (expiresIn * 1000);

        updateUserInfo(accessToken, refreshToken ?? '', expireTime, address)

        res.status(200).json({ message: 'Success', user: userObject });
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(403).json({ error: 'Invalid verifier or access tokens!' });
      }
    }
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withSessionRoute(handler);