import { usePaper } from "@/context/PaperContext";
import { ContractType, UserData } from "@/types/types";
import { parseIneligibility } from "@/utils/parseIneligibility";
import { CheckoutWithCard } from "@paperxyz/react-client-sdk";
import {
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
  useTotalCirculatingSupply,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { Loading } from "./Loading";
import { Login } from "./Login";
import { PersonalInfoCheckout } from "./PersonalInfoCheckout";
import { TicketSelection } from "./TicketSelection";
import { Toggle } from "./Toggle";
//import styles from "../styles/Theme.module.css";
//import { parseIneligibility } from "../utils/parseIneligibility";
//import { myEditionDropContractAddress, tokenId } from "../const/yourDetails";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import Modal from "./Modal";

interface CardCheckoutProps {
  contractAddress: string
  tokenId: any
  onSuccess?: () => void
  contractType?: ContractType
  contractId: string
  eventData: any
}

const CardCheckout = ({ contractAddress, tokenId, onSuccess, contractType, contractId, eventData }: CardCheckoutProps) => {
  const { address, connected, email } = usePaper();
  const [step, setStep] = useState(0)
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata } = useContractMetadata(contract);
  const [userData, setUserData] = useState<UserData>()
  const [saveUserInfo, setSaveUserInfo] = useState(false);
  const [paymentSuccesful, setPaymentSuccesful] = useState(false);
  const [maxClaimableOwned, setMaxClaimableOwned] = useState(false);

  //Check if user has the maxClaimAmount of a specific token
  const { data: ownedNFTS, error } = useOwnedNFTs(contract, address);

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

  useEffect(() => {
    if (ownedNFTS) {
      if (Number(ownedNFTS[tokenId]?.quantityOwned) === maxClaimable) {
        setMaxClaimableOwned(true)
      } else {
        setMaxClaimableOwned(false)
      }
    }
  }, [ownedNFTS, tokenId, maxClaimable])

  if (!address || !connected || buttonLoading) {
    return <Loading />
  }

  return (
    <div >
      {/* {!address && !connected &&
        <Loading />
      } */}
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
                  {/*  This drop is not ready to be minted yet. (No claim condition set) */}
                  <h2>
                    This ticket is not ready yet. Come back later.
                  </h2>
                </div>
              ) :
                (!canClaim || buttonLoading) ?
                  <div>
                    <h3 className="text-3xl">
                      {buttonLoading ? "Loading..." : buttonText}
                    </h3>
                  </div>
                  :
                  maxClaimableOwned ?
                    (
                      <div>
                        <h2>
                          You have reached the limit of tickets per account
                        </h2>
                      </div>
                    )
                    :

                    (
                      <>
                        <div className="mt-[20px]">
                          {isSoldOut ? (
                            <div>
                              <h2>Sold Out!!</h2>
                            </div>
                          ) : (
                            <div>

                              {step === 0 && (
                                <PersonalInfoCheckout
                                  address={address}
                                  onChange={(data) => {
                                    setUserData(data)
                                  }}
                                  saveUserInfo={saveUserInfo}
                                  setSaveUserInfo={setSaveUserInfo}
                                  setStep={setStep}
                                />
                              )}
                              {step === 1 && (
                                <>
                                  <CheckoutWithCard
                                    configs={{
                                      contractId: contractId,
                                      walletAddress: address,
                                      quantity: 1,
                                      email: email,
                                      contractArgs: {
                                        tokenId: tokenId
                                      }
                                    }}
                                    onPaymentSuccess={() => onSuccess && onSuccess()}
                                    onReview={(result) => console.log('onReview', result)}
                                    options={{
                                      colorBackground: '#ffffff',
                                      colorPrimary: '#99e0ff',
                                      colorText: '#363636',
                                      borderRadius: 6,
                                      inputBackgroundColor: '#ffffff',
                                      inputBorderColor: '#b0b0b0',
                                    }}
                                  />
                                  <div className='flex justify-start'>
                                    <button
                                      onClick={() => { setStep(0) }}
                                      className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4'
                                    >
                                      Back
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {!connected &&
                          <Login />
                        }
                      </>
                    )}
            </div>
          </>
        )}
      </div>


      <Modal
        show={paymentSuccesful}
      >
        <div className='p-[20px]'>
          <h2 className='font-bold text-2xl leading-7'>
            Successfully bought tickets to {eventData?.name.stringValue}!
          </h2>

          <p className='text-base mt-[10px]'>Your ticket will display in your account in less than 3 minutes</p>
          <button
            className='mt-[20px] w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple'
            onClick={() => {
              router.push(
                `/account`
              )
            }}
          >
            Go to your account
          </button>
        </div>
      </Modal>

    </div >
  );
};

export default CardCheckout;
