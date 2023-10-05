export const getShortAddress = (address?: string) => {
  if (!address) return ''
  const shortAddress = `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
  )}`;

  return shortAddress
}

export async function requestMintNFT(address: string, contract: any) {
  try {
    const tokenPrice = await getTokenPrice(contract)

    // Print initial log message.
    console.log(`Request to mint an NFT to address ${address}...`);

    // Retrieve the contract name.
    const name = await contract.methods.name().call();
    console.log(`Contract name: ${name}`);

    // Estimate the gas required to mint the NFT.
    const estimatedGas = await contract.methods
      .mintTicket(address)
      .estimateGas({ gas: 5000000, value: tokenPrice }, function (error: any, gasAmount: any) {
        if (gasAmount === 5000000) {
          console.log('Method ran out of gas');
        }
      });

    console.log(`Estimated gas: ${estimatedGas}`);

    // Prepare the transaction to mint the NFT.
    const transaction = contract.methods.mintTicket(address);
    console.log('transaction', transaction);

    // Send the transaction and wait for its receipt.
    const receipt = await transaction.send({
      from: address,
      gas: estimatedGas,
      value: tokenPrice
    });
    console.log("Transaction receipt:", receipt);

    // Extract the minted tokenId from the transaction receipt.
    const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId;
    console.log("Minted tokenId:", tokenId);

    // Return the transaction hash and tokenId.
    return { hash: receipt.transactionHash, tokenId, receipt };
  } catch (error) {
    // Log any errors that occur during the minting process.
    console.error("requestMintNFT", error);
    return false;
  }
}

export async function setNFTPrice(address: string, contract: any) {
  try {
    // Print initial log message.
    console.log(`Set nft price`);

    // Retrieve the contract name.
    const name = await contract.methods.name().call();
    console.log(`Contract name: ${name}`);

    // Estimate the gas required to mint the NFT.
    const estimatedGas = 50000
    console.log(`Estimated gas: ${estimatedGas}`);

    // Prepare the transaction to mint the NFT.
    const transaction = contract.methods.setPrice(10000);

    // Send the transaction and wait for its receipt.
    const receipt = await transaction.send({
      from: address,
      gas: estimatedGas,
    });
    console.log("Transaction receipt:", receipt);

    console.log(`https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`)

    // Return the transaction hash and tokenId.
    return { hash: receipt.transactionHash };
  } catch (error) {
    // Log any errors that occur during the minting process.
    console.error("requestMintNFT", error);
    return false;
  }
}

export async function getTokenPrice(contract: any) {
  try {
    const tokenPrice = await contract.methods.ticketPrice().call();
    return tokenPrice;
  } catch (err) {
    console.error(`Error fetching NFTs:`, err);
    return false;
  }
}

export async function getTokenIdCounter(contract: any) {
  try {
    const tokenCounter = await contract.methods.tokenIdCounter().call();
    return tokenCounter;
  } catch (err) {
    console.error(`Error fetching counter:`, err);
    return false;
  }
}

export async function getTokenOwner(contract: any, tokenId: string) {
  try {
    const tokenOwner = await contract.methods.ownerOf(tokenId).call();
    return tokenOwner;
  } catch (err) {
    console.error(`Error fetching counter:`, err);
    return false;
  }
}

export async function fetchNFTs(address: string, contract: any) {
  //console.log(`Fetch the NFTs owned by ${address} from the collection...`);

  try {
    // Get the total count of tokens owned by the `address`.
    const tokenBalance = await contract.methods.balanceOf(address).call();
    console.log(`Total NFTs owned: ${tokenBalance}`);

    const tokens = await Promise.all(
      Array.from({ length: tokenBalance }, async (_, i) => {
        try {
          // Fetch the owned token ID.
          const tokenId: any = await contract.methods
            .tokenOfOwnerByIndex(address, i)
            .call();
          // Fetch the token URI.
          const uri = await contract.methods.tokenURI(tokenId).call();
          // Convert IPFS URI to HTTPS URI.
          return ipfsToHttps(uri);
        } catch (err) {
          console.warn(`Error fetching token at index ${i}:`, err);
          return null;
        }
      }),
    );

    // Filter out null values (where token fetch failed).
    const validTokens = tokens.filter(Boolean);
    console.log("Total NFTs found:", validTokens.length);

    return validTokens;
  } catch (err) {
    console.error(`Error fetching NFTs:`, err);
    return false;
  }
}

/*
  Wrapper function to fetch a token's JSON metadata from the given URI stored on-chain
*/
export async function fetchJSONfromURI(url: string) {
  return fetch(ipfsToHttps(url))
    .then((res) => res?.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
}

/*
  parse ipfs address into https
*/
export function ipfsToHttps(uri: string) {
  uri = uri.replace("ipfs://", "https://nftstorage.link/ipfs/").toString();
  return uri;
}


export const getIpfsURL = (url?: string | null) => {
  if (!url) return ''
  if (url.includes('/ipfs/')) {
    const splittedUrl = url?.split('/ipfs/')
    return `https://ipfs.io/ipfs/${splittedUrl[1]}`
  } else if (url.includes('ipfs://')) {
    const splittedUrl = url?.split('ipfs://')
    return `https://ipfs.io/ipfs/${splittedUrl[1]}`
  }
  return ''
}