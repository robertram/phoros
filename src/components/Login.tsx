import React from 'react'
import { usePaper } from "@/context/PaperContext";
import { useDisconnect, useLogout } from '@thirdweb-dev/react';
import { Loading } from './Loading';

interface Props {
  //paper: PaperEmbeddedWalletSdk<RecoveryShareManagement.USER_MANAGED> | PaperEmbeddedWalletSdk<RecoveryShareManagement.AWS_MANAGED> | undefined;
  //onLoginSuccess: () => void;
  buttonText?: string
  className?: string
}

export const Login: React.FC<Props> = ({ buttonText, className }) => {
  const disconnect = useDisconnect();
  const { logout, isLoading } = useLogout();
  const { logIn, address, connected, connectionStatus } = usePaper()

  return (
    <button
      onClick={!connected ? logIn :
        () => {
          disconnect()
          logout()
        }
      }
      className={`w-full whitespace-nowrap mt-[20px] rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple ${className}`}
      //className={`w-full whitespace-nowrap ${className}`}
    >
      {connectionStatus === 'connecting' ? <Loading /> :
        <>
          {!connected ? buttonText ? buttonText : 'Log In' : ''}
          {connected && 'Logout'}
        </>
      }
    </button>
  );
};
