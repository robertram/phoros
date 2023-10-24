//import TwitterApi from 'twitter-api-v2';
import TwitterApi from 'twitter-api-v2';
//import { withSessionRoute } from '../../lib/session';
import { withSessionRoute } from '../../../lib/session'

//export default async function handler(req: any, res: any) {
const handler = async (req: any, res: any) => {
  try {
    const client = new TwitterApi({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(process.env.NEXT_PUBLIC_CALLBACK_URL ?? '', { scope: ['tweet.read', 'users.read', 'list.write', 'list.read',  'offline.access'] });
    
    // Save codeVerifier and state in session
    req.session.codeVerifier = codeVerifier;
    req.session.state = state;
    await req.session.save();

    res.status(200).json({ url, codeVerifier, state });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withSessionRoute(handler);
