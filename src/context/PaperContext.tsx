
import { signInWithCustomToken, signOut } from "firebase/auth";
import initializeFirebaseClient from "@/firebase/initFirebaseAuth";
import { getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import styles from "../styles/Home.module.css";
import useFirebaseUser from "@/firebase/hooks/useFirebaseUser";
import useFirebaseDocument from "@/firebase/hooks/useFirebaseUserDocument";
import Image from "next/image";

////
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePaperWallet, usePaperWalletUserEmail, useAddress, useDisconnect, useConnectionStatus, useAuth } from "@thirdweb-dev/react";

type Web3ContextType = {
  logIn: () => void
  email: string | undefined
  address: string //| undefined
  connected: boolean
  disconnect: () => void;
  connectionStatus: string
};

// Create the context with default values
const PaperContext = createContext<Web3ContextType>({
  logIn: () => { },
  email: '',
  address: '',
  connected: false,
  disconnect: () => { },
  connectionStatus: ''
});

// Custom hook to use the Web3 context
export const usePaper = () => useContext(PaperContext);

// Provider component to wrap around components that need access to the context
export const PaperProvider = ({ children }: { children: React.ReactNode }) => {
  const connectWithPaperWallet = usePaperWallet();
  const { data: email } = usePaperWalletUserEmail();
  const address = useAddress() ?? '';
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const connected = connectionStatus === 'connected' ? true : false

  const thirdwebAuth = useAuth();
  const { auth, db } = initializeFirebaseClient();
  const { user, isLoading: loadingAuth } = useFirebaseUser();
  const { document, isLoading: loadingDocument } = useFirebaseDocument();

  console.log('email', email);

  console.log('address!', address);

  console.log('connectionStatus', connectionStatus);

  const signIn = async () => {
    // Use the same address as the one specified in _app.tsx.
    const payload = await thirdwebAuth?.login({ domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN });

    try {
      // Make a request to the API with the payload.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      // Get the returned JWT token to use it to sign in with
      const { token } = await res.json();

      // Sign in with the token.
      const userCredential = await signInWithCustomToken(auth, token);
      // On success, we have access to the user object.
      const user = userCredential.user;

      // If this is a new user, we create a new document in the database.
      const usersRef = doc(db, "users", user.uid!);
      const userDoc = await getDoc(usersRef);

      if (!userDoc.exists()) {
        // User now has permission to update their own document outlined in the Firestore rules.
        setDoc(usersRef, { createdAt: serverTimestamp(), email: email }, { merge: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logIn = () => {
    connectWithPaperWallet({
      chainId: 137,
      paperClientId: process.env.NEXT_PUBLIC_PAPER_EMBEDDED_WALLET_CLIENT_ID ?? ''
    })
  }

  useEffect(() => {
    console.log('email', email);
    if (email != undefined) {
      signIn()
    }
  }, [email])

  return (
    <PaperContext.Provider
      value={{
        logIn,
        email,
        address,
        connected,
        disconnect,
        connectionStatus
      }}
    >
      {children}
    </PaperContext.Provider>
  );
};
