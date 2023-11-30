import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "./Loading";

interface ContractMetadata {
  title: string
  image?: string
}

interface TokenItemContainerProps {
  contractAddress?: string
  title: string
  image: string
  listId?: any
}

export const TokenItemContainer = ({ title, image, listId }: TokenItemContainerProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  if (loading) return <Loading />

  return (
    <Link
      href={listId ? `/list/${listId}` : '#'}
      //href={eventId && tokenId ? `/community/${eventId}/${tokenId}` : '#'}
      className={`flex p-[12px] bg-white border-solid border-[1px] border-[#D4D4D4] mb-[12px] rounded-[8px] no-underline ${listId ? 'cursor-pointer' : 'cursor-default'}`}
    >
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

    </Link>
  )
}