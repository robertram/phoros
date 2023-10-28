import { useAuth } from "@/context/AuthContext"
import ArrowDown from "@/icons/ArrowDown"
import { getShortAddress } from "@/lib/utils"
import { useRouter } from "next/router"

export const AccountButton = () => {
  const { address } = useAuth()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        router.push('/profile')
      }}
      className="rounded-[50px] p-[10px] shadow-md flex">
      {getShortAddress(address)}
      <ArrowDown />
    </button>
  )

}