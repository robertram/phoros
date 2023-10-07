import { NextApiRequest, NextApiResponse } from "next";
import initializeFirebaseServer from "@/firebase/initFirebaseAdmin";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.body?.address

  if (!address) {
    return res.status(401).json({ error: 'Not able to login' });
  }

  // Initialize the Firebase Admin SDK.
  const { auth } = initializeFirebaseServer();

  // Generate a JWT token for the user to be used on the client-side.
  const token = await auth.createCustomToken(address);

  // Send the token to the client-side.
  return res.status(200).json({ token });
};

export default login;
