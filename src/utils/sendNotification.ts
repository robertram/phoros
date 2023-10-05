import * as PushAPI from '@pushprotocol/restapi'
import { ethers } from 'ethers'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import Web3 from 'web3'
//import { getWalletClient } from '@wagmi/core'

interface NotificationParameters {
  eventName: string
}

interface Window {
  ethereum: any
  web3: Web3
}

declare const window: Window

const sendBroadcastNotification = async ({
  eventName
}: NotificationParameters) => {
  const PK = process.env.NEXT_PUBLIC_PUSH_WALLET_PK || ''
  const signer = new ethers.Wallet(PK)
  const apiResponse = await PushAPI.payloads.sendNotification({
    senderType: 0,
    signer: signer,
    type: 1, // broadcast
    identityType: 2, // direct payload
    notification: {
      title: `CheckMyTicket new event created`,
      body: `New event created. Check it out!`
    },
    payload: {
      title: `New Event ${eventName}`,
      body: `Get ready for the next event ${eventName}`,
      cta: '',
      img: ''
    },
    channel: 'eip155:5:0xc1d457128dEcAE1CC092728262469Ee796F1Ac45', // your channel address
    env: ENV.STAGING
  })
  console.log('apiResponse', apiResponse)
}

const getSigner = async () => {
  const walletClient =""//= await getWalletClient()
  return walletClient
}

const optInChannel = async (address: string, walletClient: any) => {
  console.log('address', address);
  // const web3 = new Web3(
  //   new Web3.providers.HttpProvider(
  //     process.env.NEXT_PUBLIC_ALCHEMY_URL_MUMBAI ?? ''
  //   ),
  // );
  
  const provider = await new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()


  // const signer = web3.eth.accounts.privateKeyToAccount(
  //   process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY ?? ''
  // );

  await PushAPI.channels.subscribe({
    signer: signer,
    //channelAddress: 'eip155:5:0xc1d457128dEcAE1CC092728262469Ee796F1Ac45', // channel address in CAIP
    channelAddress: 'eip155:80001:0x7518330b7CE003e67F63f1dfDdBEd69a266AaA64', // channel address in CAIP
    userAddress: `eip155:80001:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log('opt in success')
    },
    onError: () => {
      console.error('opt in error')
    },
    env: ENV.STAGING
  })
}

const optOutChannel = async (address: string, walletClient: any) => {
  const provider = await new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  await PushAPI.channels.unsubscribe({
    signer: signer,
    channelAddress: 'eip155:5:0x2AEcb6DeE3652dA1dD6b54D5fd4f7D8F43DaEb77', // channel address in CAIP
    userAddress: `eip155:5:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log('opt out success')
    },
    onError: () => {
      console.error('opt out error')
    },
    env: ENV.STAGING
  })
}

export { sendBroadcastNotification, optInChannel, optOutChannel }
