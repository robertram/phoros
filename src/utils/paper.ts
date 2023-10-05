import { usePaper } from "@/context/PaperContext";

export const checkIsAdmin = () => {
  const { address } = usePaper();

  if (address == process.env.NEXT_PUBLIC_ADMIN_ADDRESS) {
    return true
  }
  return false
}
