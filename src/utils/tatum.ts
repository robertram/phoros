import { Network } from "@tatumio/tatum";

export const chainIdMapping: any = {
  "algorand-mainnet": 4294967296,
  "arb-nova-mainnet": 79377087078960,
  "arbitrum-one-mainnet": 421611,
  "aurora-mainnet": 1313161555,
  "avalanche-c-mainnet": 43114,
  "avax-p-mainnet": 43113,
  "avax-x-mainnet": 43112,
  "bsc-mainnet": 56,
  "bitcoin-mainnet": 0,
  "bitcoin-cash-mainnet": 145,
  // "cardano-mainnet": 1,
  "celo-mainnet": 42220,
  "cro-mainnet": 93100,
  "doge-mainnet": 0,
  "eos-mainnet": 194,
  "eon-mainnet": 19165,
  "chiliz-mainnet": 60,
  "ethereum-mainnet": 1,
  "ethereum-classic-mainnet": 61,
  "fantom-mainnet": 250,
  "flare-mainnet": 16,
  "flow-mainnet": 0x0,
  // "gno-mainnet": 1,
  // "haqq-mainnet": 1,
  "one-mainnet-s0": 1666600000,
  "klaytn-mainnet": 8217,
  "kcs-mainnet": 8217,
  // "litecoin-mainnet": 1,
  // "egld-mainnet": 1,
  "near-mainnet": 1313161554,
  "oasis-mainnet": 42261,
  "optimism-mainnet": 10,
  "palm-mainnet": 11297108099,
  "polygon-mainnet": 137,
  "dot-mainnet": 354,
  "rsk-mainnet": 30,
  "solana-mainnet": 101,
  // "stellar-mainnet": 1,
  "tezos-mainnet": 8732,
  "tron-mainnet": 195,
  "vechain-mainnet": 74,
  "xdc-mainnet": 50,
  "ripple-mainnet": 144,
  "zcash-mainnet": 133,
  // "zilliqa-mainnet": 1,
  "algorand-testnet": 898,
  "arb-testnet": 421611,
  "aurora-testnet": 1313161555,
  "avax-testnet": 43113,
  "avax-p-testnet": 43113,
  "avax-x-testnet": 43112,
  "bsc-testnet": 97,
  // "bitcoin-testnet": 1,
  // "bch-testnet": 1,
  "cardano-preprod": 0,
  "celo-testnet": 42218,
  "cro-testnet": 93111,
  // "doge-testnet": 1,
  "ethereum-goerli": 5,
  "ethereum-sepolia": 7,
  "ethereum-holesky": 6,
  "eos-testnet": 194,
  "fantom-testnet": 4002,
  "flare-coston": 16,
  "flare-coston2": 16,
  "flare-songbird": 17,
  "flow-testnet": 4,
  // "gno-testnet": 1,
  // "haqq-testnet": 1,
  "one-testnet-s0": 1666600001,
  "horizen-eon-gobi": 40,
  "klaytn-baobab": 1001,
  "kcs-testnet": 8221,
  // "litecoin-testnet": 1,
  // "egld-testnet": 1,
  "near-testnet": 1313161554,
  "oasis-testnet": 42,
  "optimism-testnet": 28,
  "palm-testnet": 11297108099,
  "polygon-mumbai": 80001,
  "dot-testnet": 31,
  "rsk-testnet": 31,
  "solana-devnet": 111,
  "stellar-testnet": 3,
  "tezos-testnet": 2,
  "tron-testnet": 16,
  "vechain-testnet": 2,
  "xdc-testnet": 50,
  // "ripple-testnet": 1,
  // "zcash-testnet": 1,
  "zilliqa-testnet": 333,
};

export const getChainName = (activeChain: number): any => {
  for (const chainName in chainIdMapping) {
    if (chainIdMapping[chainName] === activeChain) {
      return chainName;
    }
  }

  // Return null or a default value if the chain ID is not found in the mapping
  return null;
}