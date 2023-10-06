
// AuthProvider.js
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';

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

  console.log('user!', user);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, name, profileImage }}>
      {children}
    </AuthContext.Provider>
  );
};


