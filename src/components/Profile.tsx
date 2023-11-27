
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

interface ProfileProps {
  user: any
  loggedIn: boolean
}

export const Profile = ({ user, loggedIn }: ProfileProps) => {
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(user?.id ?? '');
  const { data: ens, isError, isLoading } = useEnsName({
    address: user?.id
  })
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [openUsernameModal, setOpenUsernameModal] = useState<boolean>(false);
  const [addedToClipboard, setAddedToClipboard] = useState<boolean>(false);

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
    <div className='px-[16px] max-w-large flex items-center m-auto'>
      <div className="w-full">
        <div className="m-auto">
          <img src={user?.profilePicture} className="w-[100px] h-[100px] object-cover m-auto rounded-full bg-gray-500" />
        </div>

        <div className="mt-[20px]">
          <p className="text-base font-bold text-center">{ens ? ens : getShortAddress(user?.id)}</p>
          {user?.username && <p className="text-base font-bold text-center">{user?.username}</p>}
          <p>{user?.bio}</p>
        </div>

        <div className="flex justify-between gap-4 mt-[50px]">
          <InfoCard
            title="Poaps"
            value={poaps?.length}
          />
          <InfoCard
            title="Lists"
            value="0"
          />
        </div>

        <div className="mt-[30px]">
          <SocialsButtons socialLinks={socialLinks} />
        </div>

        {loggedIn &&
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
                  if (user?.username) {
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
                  } else {
                    setOpenUsernameModal(true)
                  }
                }}
                title={addedToClipboard ? "Link copied to your Clipboard" : "Share"}
                icon={<Rocket className="m-auto" />}
              //loading={loading}
              />
            </div>
            <CardButton
              onClick={() => disconnect()}
              title="Logout"
              icon={<Rocket className="m-auto" />}
              className="mt-[20px]"
            //loading={loading}
            />
          </div>
        }

        <UsernameModal open={openUsernameModal} setOpen={setOpenUsernameModal} />


      </div>
    </div>

  )
}