import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Loading } from "./Loading";

interface ContractMetadata {
  title: string
  image?: string
}

interface CollectionInfoProps {
  contractAddress?: string
  title: string
  image: string
}

export const CollectionInfo = ({ contractAddress, title, image }: CollectionInfoProps) => {
  const [contractMetadata, setContractMetadata] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  if (loading) return <Loading />

  return (
    <div className="flex p-[12px] bg-gray-100 mb-[12px] rounded-[8px]">
      <div className="mr-[12px]">
        <img src={image} className="w-[64px] h-[64px] object-cover rounded-full"></img>
      </div>
      <div className="">
        <p className="text-1xl">{title}</p>
        
        {/* <div className="flex">
          <p className="text-base">
            250 members
          </p>
        </div> */}
      </div>

      {/* <div>
        {image && <img src={image} />}
      </div> */}

    </div>
  )
}