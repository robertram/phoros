import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { AuthProvider } from '@/context/AuthContext';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygonMumbai, gnosis, gnosisChiado, goerli, polygon } from 'wagmi/chains'
import localFont from 'next/font/local'
import {
  ThirdwebProvider,
} from "@thirdweb-dev/react";

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Regular.otf',
      weight: '400'
    },
    {
      path: '../../public/fonts/Satoshi-Bold.otf',
      weight: '700'
    }
  ],
  variable: '--font-satoshi'
})

function MyApp({ Component, pageProps }: any) {
  const router = useRouter()
  // 1. Get projectId
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''

  // 2. Create wagmiConfig
  const metadata = {
    name: 'Phoros',
    description: 'Phoros',
    url: 'https://phoros.io',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const chains = [mainnet, arbitrum, polygonMumbai, polygon, gnosis, gnosisChiado, goerli]
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
  createWeb3Modal({ wagmiConfig, projectId, chains })

  return (
    <WagmiConfig config={wagmiConfig}>
      <ThirdwebProvider
        // activeChain={activeChain}
        // clientId={clientId}
        sdkOptions={{
          gasless: {
            openzeppelin: {
              relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_DEFENDER_URL ?? ''
            },
          },
        }}
      >
        <AuthProvider>
          {/* <Layout> */}
          <main className={`${satoshi.variable} `}>
            <Component {...pageProps} />
            <Analytics />
          </main>
          {/* </Layout> */}
        </AuthProvider>
      </ThirdwebProvider>
    </WagmiConfig>
  )
}

export default MyApp
