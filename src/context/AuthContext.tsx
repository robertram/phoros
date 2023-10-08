
// AuthProvider.js
import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';
import { ethers } from "ethers";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import initializeFirebaseClient from "@/firebase/initFirebaseAuth";
import { Network, Alchemy } from 'alchemy-sdk'

type AuthContextType = {
  address: string
  user: any
  login: () => void
  logout: () => void
  name: string
  profileImage: string
  activeChain: number
};

export const AuthContext = createContext<AuthContextType>({
  address: '',
  user: null,
  login: () => { },
  logout: () => { },
  name: '',
  profileImage: '',
  activeChain: 1,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [address, setAddress] = useState<any>(undefined);
  const [activeChain, setActiveChain] = useState<any>(1);
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const createUser = async (address?: string) => {
    if (!address) return null

    try {
      // Make a request to the API with the payload.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
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
    const getUserWallet = async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setAddress(addresses[0])
        setActiveChain(provider?._network?.chainId)
      } else {

      }
    }

    getUserWallet()
      .catch(console.error);
  }, [])

  // useEffect(() => {
  //   const getUserWallet = async () => {
  //     const provider = new ethers.providers.Web3Provider(
  //       (window as any).ethereum
  //     );
  //   }

  //   getUserWallet()
  //     .catch(console.error);
  // }, [])

  return (
    <AuthContext.Provider value={{ address, user, login, logout, name, profileImage, activeChain }}>
      {children}
    </AuthContext.Provider>
  );
};


