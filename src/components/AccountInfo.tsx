import { usePaper } from "@/context/PaperContext";
import { getShortAddress } from "@/lib/utils";
import { UserData } from "@/types/types";
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import Button from "./Button";
import { useRouter } from 'next/router';

interface AccountInfoProps {
  userInfo?: UserData
}

export const AccountInfo = ({ userInfo }: AccountInfoProps) => {
  const { email, address } = usePaper();
  const router = useRouter();

  return (
    <div className="mb-[50px] md:mb-[100px]">
      <div className="relative">
        <div className="banner w-full h-[200px] md:h-[400px] bg-slate-500">
          <div className="absolute md:bottom-[20px] md:right-[50px] bottom-[10px] right-[20px]">
            <Button secondary onClick={() => { router.push('/account/edit') }}>Edit Profile</Button>
          </div>
        </div>

        <div className="absolute left-[20px] md:left-[30px] bottom-[-30px] md:bottom-[-50px] rounded-full w-[100px] h-[100px] bg-slate-800 md:w-[150px] md:h-[150px]">
          {/* <AvatarGenerator username="rsft6000@gmai.com" className="m-auto w-[100px] h-[100px] md:w-[150px] md:h-[150px]" /> */}

          <img
            className="rounded-full object-cover h-full"
            src={userInfo?.profilePicture ? userInfo?.profilePicture : "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"}
          />

        </div>
      </div>

      <div className="flex">
        <div className="mt-[70px] mx-[20px] md:mx-[40px]">
          <p>{userInfo?.name}</p>
          <p>{email}</p>
          <p>{getShortAddress(address)} </p>
          <div className="h-min mt-[10px]">
            <ConnectWallet />
          </div>


        </div>


      </div>

    </div>
  )
}