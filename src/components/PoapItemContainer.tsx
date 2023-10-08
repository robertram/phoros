import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Loading } from "./Loading";

interface ContractMetadata {
  title: string
  image?: string
}

interface PoapItemContainerProps {
  contractAddress?: string
  title: string
  image: string
  eventId: string
  tokenId: any
}

export const PoapItemContainer = ({ title, image, eventId, tokenId }: PoapItemContainerProps) => {
  const [contractMetadata, setContractMetadata] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  if (loading) return <Loading />

  return (
    <a
      href={`/community/${eventId}/${tokenId}`}
      className="flex p-[12px] bg-gray-100 mb-[12px] rounded-[8px] no-underline cursor-pointer">
      <div className="mr-[12px]">
        <img src={image} className="min-w-[64px] min-h-[64px] w-[64px] h-[64px] object-cover rounded-full"></img>
      </div>
      <div className="">
        <p className="text-1xl font-medium">{title}</p>

        {/* <div className="flex">
          <p className="text-base">
            250 members
          </p>
        </div> */}
      </div>

      {/* <div>
        {image && <img src={image} />}
      </div> */}

    </a>
  )
}