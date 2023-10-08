import Create from "@/icons/Create"

export const FloatingButton = () => {
  return (
    <a
      href="/create-list"
      className="flex text-white rounded-full bg-[#4BA3E3] w-[60px] h-[60px] no-underline absolute bottom-[20px] right-[20px] z-50">
      <Create className="m-auto" />
    </a>
  )
}