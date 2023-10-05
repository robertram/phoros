import { usePaper } from "@/context/PaperContext";
import { ContractType } from "@/types/types";
import { parseIneligibility } from "@/utils/parseIneligibility";
import {
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { Loading } from "./Loading";
import { Login } from "./Login";
import { TicketSelection } from "./TicketSelection";
//import styles from "../styles/Theme.module.css";
//import { parseIneligibility } from "../utils/parseIneligibility";
//import { myEditionDropContractAddress, tokenId } from "../const/yourDetails";

interface CryptoCheckoutProps {
  contractAddress: string
  tokenId: any
  onSuccess?: () => void
  contractType?: ContractType
}

const CryptoCheckout = ({ contractAddress, tokenId, onSuccess, contractType }: CryptoCheckoutProps) => {
  const { connected, address } = usePaper()
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata } = useContractMetadata(contract);

  const claimConditions = useClaimConditions(contract);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    address,
    tokenId
  );

  const claimerProofs = useClaimerProofs(contract, address || "", tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    contract,
    {
      quantity,
      walletAddress: address || "",
    },
    tokenId
  );

  const claimedSupply = useTotalCirculatingSupply(contract, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading || claimedSupply.isLoading || !contract
    );
  }, [activeClaimCondition.isLoading, contract, claimedSupply.isLoading]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Tickets not available"//"Sold Out";
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return "Reserve (Free)";
      }
      return `Buy (${priceToMint})`;
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return "Checking eligibility...";
    }

    return "Claiming not available";
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

  return (
    <div >
      <div >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div >
              {/* Title of your NFT Collection */}
              {/* <h1>{contractMetadata?.name}</h1> */}
              {/* Description of your NFT Collection */}
              {/* <p >
                {contractMetadata?.description}
              </p> */}
            </div>

            <div >
              {/* Amount claimed so far */}
              {/* <div >
                <div>
                  <p>Total Minted</p>
                </div>
                <div >
                  {claimedSupply ? (
                    <p>
                      <b>{numberClaimed}</b>
                      {" / "}
                      {numberTotal || "∞"}
                    </p>
                  ) : (
                    // Show loading state if we're still loading the supply
                    <p>Loading...</p>
                  )}
                </div>
              </div> */}

              {claimConditions.data?.length === 0 ||
                claimConditions.data?.every(
                  (cc) => cc.maxClaimableSupply === "0"
                ) ? (
                <div>
                  <h2>
                    This drop is not ready to be minted yet. (No claim condition
                    set)
                  </h2>
                </div>
              ) : (
                <>
                  <p>Quantity</p>
                  <div>
                    <TicketSelection
                      value={quantity}
                      onClickMore={() => {
                        setQuantity(
                          quantity + 1
                        )
                      }}
                      disabledMore={quantity >= maxClaimable}
                      onClickLess={() => {
                        setQuantity(
                          quantity - 1
                        )
                      }}
                      disabledLess={quantity <= 1}
                    />
                  </div>

                  {connected &&
                    <div className="mt-[20px]">
                      {isSoldOut ? (
                        <div>
                          <h2>Sold Out</h2>
                        </div>
                      ) : (
                        <Web3Button
                          contractAddress={contract?.getAddress() || ""}
                          action={(cntr) => {
                            //contract && contract.erc721.claim(quantity)

                            if (contractType === ContractType.editionDrop) {
                              contract && contract.erc1155.claim(tokenId, quantity)
                            } else if (contractType === ContractType.nftDrop) {
                              contract && contract.erc721.claim(quantity)
                            }
                          }}
                          isDisabled={!canClaim || buttonLoading}
                          onError={(err) => {
                            console.error('ERROR', err);
                            //alert("Error claiming NFTs");
                          }}
                          onSuccess={() => {
                            onSuccess && onSuccess()
                            //setQuantity(1);
                            //alert("Successfully claimed NFTs");
                          }}
                        >
                          {buttonLoading ? "Loading..." : buttonText}
                        </Web3Button>
                      )}
                    </div>
                  }

                  {!connected &&
                    <Login />
                  }
                </>
              )}
            </div>
          </>
        )}
      </div>

    </div >
  );
};

export default CryptoCheckout;
