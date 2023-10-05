import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { PaperProvider } from "@/context/PaperContext";
import { paperWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-quill/dist/quill.snow.css';
import { AuthProvider } from '@/context/AuthContext';

function MyApp({ Component, pageProps }: any) {
  const router = useRouter()
  const activeChain = process.env.NEXT_PUBLIC_CHAIN
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  const paperClientId = process.env.NEXT_PUBLIC_PAPER_EMBEDDED_WALLET_CLIENT_ID

  return (
    <AuthProvider>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={clientId}
        supportedWallets={[
          paperWallet({
            paperClientId: paperClientId ?? ''
          }),
        ]}
        authConfig={{
          // Set this to your domain to prevent signature malleability attacks.
          domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN ?? '',
          //authUrl: '/api/auth',
        }}
      // sdkOptions={{
      //   gasless: {
      //     openzeppelin: {
      //       relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_DEFENDER_URL ?? ''
      //     },
      //   },
      // }}
      >
        <PaperProvider>
          {/* <Layout> */}
          <Component {...pageProps} />
          <Analytics />
          {/* </Layout> */}
        </PaperProvider>
      </ThirdwebProvider>
    </AuthProvider>
  )
}

export default MyApp
