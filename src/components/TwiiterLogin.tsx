import React, { useContext } from 'react'

import { AuthContext } from '@/context/AuthContext';
import { Avatar } from './Avatar';
//import initializeFirebaseClient from "@/firebase/initFirebaseAuth";

interface Props {
  buttonText?: string
  className?: string
}

export const TwitterLogin: React.FC<Props> = ({ buttonText, className }) => {
  // const { auth, db } = initializeFirebaseClient();
  const { user, name, profileImage, login, logout } = useContext(AuthContext);

  return (
    <div>
      {user ? <Avatar title={name}  /> : <button onClick={login}>Login With Twitter</button>}
    </div>
  )
};
