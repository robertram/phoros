
import { getShortAddress } from "@/lib/utils";
import { useEnsName } from "wagmi";
import { useDisconnect } from 'wagmi'
import { CardButton } from "@/components/CardButton";
import Edit from "@/icons/Edit";
import Rocket from "@/icons/Rocket";
import { InfoCard } from "@/components/InfoCard";
import { useRouter } from "next/router";
import usePoaps from "@/hooks/usePoaps";
import { SocialsButtons } from "./SocialsButtons";
import { useEffect, useState } from "react";
import { generateSocialLinks } from "@/utils/utils";
import { UsernameModal } from "./UsernameModal";
import Logout from "@/icons/Logout";
import useFetchNFTBalance from "@/hooks/useFetchNFTBalance";
import { getDocuments, db } from "@/firebase/firestore/getData";
import { query, collection, where, arrayUnion } from "firebase/firestore";
import { Loading } from "./Loading";
import { useAuth } from "@/context/AuthContext";

interface ProfileProps {
  user: any
  loggedIn: boolean
  setRefreshUser: (refresh: boolean) => void
}

export const Profile = ({ user, loggedIn, setRefreshUser }: ProfileProps) => {
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const { address } = useAuth()
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(user?.id ?? '');
  const { nfts, loading: nftsLoading } = useFetchNFTBalance(user?.id ?? '');
  const { data: ens, isError, isLoading } = useEnsName({
    address: user?.id
  })
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [addedToClipboard, setAddedToClipboard] = useState<boolean>(false);
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

  useEffect(() => {
    if (addedToClipboard) {
      setTimeout(() => {
        setAddedToClipboard(false)
      }, 2000);
    }
  }, [addedToClipboard])

  useEffect(() => {
    if (user) {
      const newSocialLinks = generateSocialLinks(user, socialLinks);

      if (newSocialLinks.length > 0) {
        setSocialLinks((prevLinks: any) => [...prevLinks, ...newSocialLinks]);
      }
    }
  }, [user, socialLinks]);

  return (
    <div className='max-w-large flex items-center m-auto'>
      <div className="w-full">
        <div className="relative">
          <div className="banner w-full h-[124px] md:h-[200px] bg-gradient-to-b from-[#5CFF63] to-[#009657]">
            {/* <div className="absolute md:bottom-[20px] md:right-[50px] bottom-[10px] right-[20px]">
               <Button secondary onClick={() => { router.push('/account/edit') }}>Edit Profile</Button> 
            </div> */}
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

          <div className="flex justify-between gap-4 mt-[30px]">
            <InfoCard
              title="Collectibles"
              value={poapsLoading || nftsLoading ? '-' : poaps?.length + nfts?.length}
            />
            <InfoCard
              title="Lists"
              value={`${lists?.length ?? '0'}`}
              className="cursor-pointer"
              onClick={() => {
                router.push(`/u/${user?.username ? user?.username : user?.id}/lists`)
              }}
            />
          </div>

          <div className="mt-[30px]">
            <SocialsButtons socialLinks={socialLinks} />
          </div>

          {loggedIn && user?.id === address &&
            <div>
              <div className="flex justify-between gap-4 mt-[50px]">
                <CardButton
                  onClick={() => {
                    router.push('/edit-profile')
                  }}
                  title="Edit"
                  icon={<Edit className="m-auto" />}
                />
                <CardButton
                  onClick={() => {
                    // if (user?.username) {
                    if (navigator.share) {
                      navigator.share({
                        url: `https://app.phoros.io/user/${user?.username}`,
                      })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing:', error));
                    } else {
                      navigator.clipboard.writeText(`https://app.phoros.io/user/${user?.username}`)
                      setAddedToClipboard(true)
                      console.log('Web Share API is not supported in your browser.');
                    }
                    // } else {
                    //   setOpenUsernameModal(true)
                    // }
                  }}
                  title={addedToClipboard ? "Link copied to your Clipboard" : "Share"}
                  icon={<Rocket className="m-auto" />}
                //loading={loading}
                />
              </div>
              <CardButton
                onClick={() => disconnect()}
                title="Logout"
                icon={<Logout className="m-auto" />}
                className="mt-[20px]"
              //loading={loading}
              />
            </div>
          }

          {/* <UsernameModal open={openUsernameModal} setOpen={setOpenUsernameModal} setRefreshUser={setRefreshUser} /> */}
        </div>
      </div>
    </div>
  )
}