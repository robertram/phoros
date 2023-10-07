import { useAuth } from '@/context/AuthContext';
import React from 'react'
import { Avatar } from './Avatar';
//import initializeFirebaseClient from "@/firebase/initFirebaseAuth";

interface Props {
  buttonText?: string
  className?: string
}

export const TwitterLogin: React.FC<Props> = ({ buttonText, className }) => {
  const { user, name, profileImage, login, logout } = useAuth();

  return (
    <div>
      {user ? <Avatar title={name}  /> : <button onClick={login}>Login With Twitter</button>}
    </div>
  )
};
