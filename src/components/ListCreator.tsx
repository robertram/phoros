import { useEffect, useState } from "react";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where } from "firebase/firestore";
import { getShortAddress } from "@/lib/utils";
import Verified from "@/icons/Verified";
import Redirect from "@/icons/Redirect";

interface ListCreatorProps {
  id: string
}

export const ListCreator = ({ id }: ListCreatorProps) => {
  const [listOwner, setListOwner] = useState<any>();

  useEffect(() => {
    const getAllData = async () => {
      const customQuery = query(collection(db, "users"), where("id", "==", id));
      return await getDocuments({ customQuery })
    }

    if (id) {
      getAllData().then((result: any) => {
        setListOwner(result.result[0])
      })
    }
  }, [id]);

  return (
    <div className="flex justify-between">
      <p>Creator:</p>
      <a className="flex" href={`/u/${listOwner?.username
        ? listOwner?.username
        : (listOwner?.ens
          ? listOwner?.ens
          : listOwner?.id)}`}>
        <img src={listOwner?.profilePicture} className="w-[25px] h-[25px] rounded-full mr-[5px]" />
        <p className="mr-[5px]">{listOwner?.username
          ? listOwner?.username
          : (listOwner?.ens
            ? listOwner?.ens
            : getShortAddress(listOwner?.id))}</p>
        <Verified className="my-auto mr-[5px]" />
        <Redirect className="my-auto mr-[5px]" />
      </a>
    </div>
  )
}