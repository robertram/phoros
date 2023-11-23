import { useState } from "react"
import { DigitalCollectionTabs } from "./DigitalCollectionTabs"
import Modal from "./Modal"
import { NFTsSelection } from "./NFTsSelection"
import { PoapsSelection } from "./PoapsSelection"

interface DigitalCollectionSelectProps {
  requiredPoaps: any
  setRequiredPoaps: (items: any) => void
  requiredNFTs: any
  setRequiredNFTs: (items: any) => void
}

export const DigitalCollectionSelect = ({ setRequiredNFTs, setRequiredPoaps, requiredNFTs, requiredPoaps }: DigitalCollectionSelectProps) => {
  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0);

  const tabsList = ["POAPs", "NFTs"]

  return (
    <div className="my-auto">
      <button className="text-primary"
        onClick={(event) => {
          event?.preventDefault()
          setShowSelectionModal(!showSelectionModal)
        }}
      >SELECT</button>

      <Modal
        show={showSelectionModal}
        setShow={() => setShowSelectionModal(false)}
        className="!top-[40px]"
      >
        <div className="flex justify-between mb-[10px]">
          <p>Select digital collection</p>

          <button className=""
            onClick={(event) => {
              event?.preventDefault()
              setShowSelectionModal(false)
            }}
          >Close</button>
        </div>

        <DigitalCollectionTabs
          tabs={tabsList}
          activeTab={activeTab}
          setActiveTab={(tabIndex: number) => {
            setActiveTab(tabIndex)
          }}
        />

        {activeTab === 0 &&
          <PoapsSelection poapsSelection={requiredPoaps} setPoapsSelection={setRequiredPoaps} />
        }

        {activeTab === 1 &&
          <NFTsSelection nftsSelection={requiredNFTs} setNFTSSelection={setRequiredNFTs} />
        }

        <button
          onClick={(e) => {
            e.preventDefault()
            setShowSelectionModal(false)
          }}
          className='mt-[10px] !bg-primary rounded-[8px] text-white p-[10px] px-[20px] cursor-pointer w-full'
        >
          Confirm
        </button>
      </Modal>
    </div>
  )
}