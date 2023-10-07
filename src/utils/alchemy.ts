import { Network, Alchemy } from 'alchemy-sdk'

const settings = {
  apiKey: process.env.NEXT_PUBIC_ALCHEMY_API, // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
};

export const alchemy = new Alchemy(settings);