import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import React from "react";
import Link from "next/link";
import { NFT } from "./NFT";
import { Loading } from "./Loading";
import { MarketplaceNFT } from "./MarketplaceNFT";
//import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

type Props = {
  collectionAddress: string
  marketplaceAddress: string
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  collectionAddress,
  marketplaceAddress,
  isLoading,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found",
}: Props) {

  return (
    <div className="flex flex-wrap">
      {isLoading ? (
        <Loading />
      ) : data && data.length > 0 ? (
        data.map((nft) =>
          !overrideOnclickBehavior ? (
            <MarketplaceNFT nft={nft} collectionAddress={collectionAddress} marketplaceAddress={marketplaceAddress} link={`/marketplace/tickets/${collectionAddress}/${nft.metadata.id}`} key={nft.metadata.id} />
          ) : (
            <MarketplaceNFT
              nft={nft}
              collectionAddress={collectionAddress}
              marketplaceAddress={marketplaceAddress}
              onClick={() => {
                overrideOnclickBehavior(nft)
              }}
              key={nft.metadata.id}
            />
          ))
      ) : (
        <div>{emptyText}</div>
      )}
    </div>
  )
}