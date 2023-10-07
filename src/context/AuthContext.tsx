
// AuthProvider.js
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';
import { ethers } from "ethers";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import initializeFirebaseClient from "@/firebase/initFirebaseAuth";

type AuthContextType = {
  user: any
  login: () => void
  logout: () => void
  name: string
  profileImage: string
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  name: '',
  profileImage: ''
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const { auth, db } = initializeFirebaseClient();

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
      setUser(userData)
      setName(userData?._tokenResponse?.screenName)
      setProfileImage(userData?._tokenResponse?.photoUrl)
    } else {
      console.error('localStorage is not available in this environment.');
    }
  }, [])

  const login = () => {
    const provider = new TwitterAuthProvider()
    signInWithPopup(auth, provider).then((res: any) => {
      console.log('res', res)
      localStorage.setItem('user', JSON.stringify(res));
      setUser(res);
      setName(res?._tokenResponse.screenName)
      setProfileImage(user?._tokenResponse.photoUrl)
    })
  }

  //Clear user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const createUser = async (address?: string) => {
    if(!address) return null

    try {
      // Make a request to the API with the payload.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      console.log('res auth context', res);
      

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
        setDoc(usersRef, { createdAt: serverTimestamp() }, { merge: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    createUser(address)
  }, [address])

  useEffect(() => {
    // declare the data fetching function
    const getUserWallet = async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const addresses = await provider.listAccounts();
      // it doesn't create metamask popup
      if (addresses.length) {
        setAddress(addresses[0])
        console.log('addresses', addresses);
      } else { }
    }

    // call the function
    getUserWallet()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, name, profileImage }}>
      {children}
    </AuthContext.Provider>
  );
};


