import { useState } from "react"
import Modal from "./Modal"
import { PoapsSelection } from "./PoapsSelection"

interface DigitalCollectionSelectProps {
  collectiblesSelection: any
  setCollectiblesSelection: (items: any) => void
}

export const DigitalCollectionSelect = ({ collectiblesSelection, setCollectiblesSelection }: DigitalCollectionSelectProps) => {
  const [showSelectionModal, setShowSelectionModal] = useState(false)

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

        <PoapsSelection poapsSelection={collectiblesSelection} setPoapsSelection={setCollectiblesSelection} />

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