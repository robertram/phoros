import React from "react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useContract, useCreateAuctionListing, useCreateDirectListing } from "@thirdweb-dev/react";
//import { marketplaceAddress, NFT_COLLECTION_ADDRESS } from "../const/addresses";
//import { Box, input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";

type Props = {
    collectionAddress: string
    marketplaceAddress: string
    nft: NFTType;
};

type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
};

//Add for Auction
type AuctionFormData = {
    nftContractAddress: string;
    tokenId: string;
    startDate: Date;
    endDate: Date;
    floorPrice: string;
    buyoutPrice: string;
};

export default function SaleInfo({ collectionAddress, marketplaceAddress, nft }: Props) {
    const router = useRouter();
    const { contract: marketplace } = useContract(marketplaceAddress, "marketplace-v3");
    const { contract: nftCollection } = useContract(collectionAddress);
    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

    async function checkAndProvideApproval() {

        var hasApproval = await nftCollection?.erc1155.isApproved(nft?.owner, marketplaceAddress);

        if (!hasApproval) {
            const txResult = await nftCollection?.erc1155.setApprovalForAll(
                marketplaceAddress,
                true
            );

            if (txResult) {
                console.log("Approval provided");
            }
        }

        return true;
    }

    const { register: registerDirect, handleSubmit: handleSubmitDirect } = useForm<DirectFormData>({
        defaultValues: {
            nftContractAddress: collectionAddress,
            tokenId: '0', //nft.metadata.id,
            price: "0",
            startDate: new Date(),
            endDate: new Date(),
        },
    });

    async function handleSubmissionDirect(data: DirectFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
            startTimestamp: new Date(data.startDate),
            endTimestamp: new Date(data.endDate),
        });

        return txResult;
    }

    //Add for Auction
    const { mutateAsync: createAuctionListing } =
        useCreateAuctionListing(marketplace);

    const { register: registerAuction, handleSubmit: handleSubmitAuction } =
        useForm<AuctionFormData>({
            defaultValues: {
                nftContractAddress: collectionAddress,
                tokenId: nft.metadata.id,
                startDate: new Date(),
                endDate: new Date(),
                floorPrice: "0",
                buyoutPrice: "0",
            },
        });

    async function handleSubmissionAuction(data: AuctionFormData) {
        await checkAndProvideApproval();
        const txResult = await createAuctionListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            buyoutBidAmount: data.buyoutPrice,
            minimumBidAmount: data.floorPrice,
            startTimestamp: new Date(data.startDate),
            endTimestamp: new Date(data.endDate),
        });

        return txResult;
    }

    return (
        <div>
            <div >
                <div>
                    <p>Listing starts on:</p>
                    <input
                        className="text-black"
                        placeholder="Select Date and Time"
                        type="datetime-local"
                        {...registerDirect("startDate")}
                    />
                    <p >Listing ends on:</p>
                    <input
                        className="text-black"
                        placeholder="Select Date and Time"
                        type="datetime-local"
                        {...registerDirect("endDate")}
                    />
                </div>
                <div>
                    <p >Price:</p>
                    <input
                        className="text-black"
                        placeholder="0"
                        type="number"
                        {...registerDirect("price")}
                    />
                </div>
                <button
                    //contractAddress={marketplaceAddress}
                    onClick={async () => {
                        await handleSubmitDirect(handleSubmissionDirect)();
                    }}
                // onSuccess={(txResult) => {
                //     router.push(`/token/${collectionAddress}/${nft.metadata.id}`);
                // }}
                >Create Direct Listing</button>
            </div>
        </div >
    )
}