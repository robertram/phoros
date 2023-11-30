import { getShortAddress } from "@/lib/utils";
import { useEnsName } from "wagmi";
import { useEffect, useState } from "react";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where, arrayUnion } from "firebase/firestore";
import { TokenItemContainer } from "./TokenItemContainer";

interface ProfileListsProps {
  user: any
}

export const ProfileLists = ({ user }: ProfileListsProps) => {
  const { data: ens, isError, isLoading } = useEnsName({
    address: user?.id
  })
  const [lists, setLists] = useState<any[]>([]);

  const getAllData = async () => {
    const customQuery = query(collection(db, "lists"), where("owner", "==", user?.id));
    return await getDocuments({ customQuery })
  }

  useEffect(() => {
    if (user?.id) {
      getAllData().then((result: any) => {
        setLists(result.result)
      })
    }
  }, [user]);

  return (
    <div className='max-w-large flex items-center m-auto'>
      <div className="w-full">
        <div className="relative">
          <div className="banner w-full h-[124px] md:h-[200px] bg-gradient-to-b from-[#5CFF63] to-[#009657]">
          </div>

          <div className="absolute left-[20px] md:left-[30px] bottom-[-30px] md:bottom-[-50px] rounded-full w-[100px] h-[100px] bg-slate-800 md:w-[150px] md:h-[150px]">
            <img
              className="rounded-full object-cover h-full w-full"
              src={user?.profilePicture}
            />
          </div>
        </div>

        <div className="px-[16px]">
          <div className="mt-[40px] md:mt-[70px]">
            <p className="text-base font-bold text-grayed">{ens ? ens : getShortAddress(user?.id)}</p>
            {user?.username && <p className="text-base font-bold text-grayed">{user?.username}</p>}
            <p className="mt-[10px] text-grayed">{user?.bio}</p>
          </div>

          <div className="mt-[20px]">
            <div className="flex justify-center w-full rounded-[8px] py-[8px] px-[15px] bg-white border-solid border-[1px] border-[#D4D4D4] mb-[12px]">
              <p className="text-[18px] my-auto mr-[5px] font-bold">{lists.length ?? '-'}</p>
              <p className="text-base my-auto">Lists</p>
            </div>

            {lists.map((item, index) => {
              return (
                <TokenItemContainer
                  title={item.name}
                  image={item.image}
                  listId={item.listId}
                  key={index}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}