import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { Toggle } from "./Toggle";
import { Loading } from "./Loading";
import AddUser from "@/icons/AddUser";
import Twitter from "@/icons/Twitter";
import { CardButton } from "./CardButton";
import Rocket from "@/icons/Rocket";
import Edit from "@/icons/Edit";
import { limitStringTo200Characters } from "@/utils/utils";
import { useRouter } from "next/router";

interface NewListCreatedProps {
  listData: any
  createdListInformation: any
}

export const NewListCreated = ({ listData, createdListInformation }: NewListCreatedProps) => {
  const router = useRouter();

  return (
    <div className="mt-[20px]">

      <img src="success.png" className="w-full"/>
      <h1 className="text-2xl mt-[20px]">Your list is ready!</h1>
      <p className='text-base'>Congratulations, now you can share your list to add members and/or followers to it</p>

      {listData &&
        <div className="flex justify-between gap-4 mt-[50px]">
          <CardButton
            onClick={() => {
              window.open(`https://twitter.com/i/lists/${createdListInformation?.data?.id}`)
            }}
            title="Go to List"
            icon={<Edit className="m-auto" />}
          />
          <CardButton
            title="Share"
            icon={<Rocket className="m-auto" />}
          //loading={loading}
          />
        </div>
      }
    </div>
  )
}