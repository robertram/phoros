
import { getShortAddress } from "@/lib/utils";
import { useEnsName } from "wagmi";
import { useDisconnect } from 'wagmi'
import { CardButton } from "@/components/CardButton";
import Edit from "@/icons/Edit";
import Rocket from "@/icons/Rocket";
import { InfoCard } from "@/components/InfoCard";
import { useRouter } from "next/router";
import Twitter from "@/icons/Twitter";
import Telegram from "@/icons/Telegram";
import { LinkCard } from "@/components/LinkCard";
import usePoaps from "@/hooks/usePoaps";
//import Discord from "@/icons/Discord";
import Linkedin from "@/icons/Linkedin";

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

  return (
    <div className='px-[16px] max-w-large flex items-center m-auto'>
      <div className="w-full">
        <div className="m-auto">
          <img src={user?.profilePicture} className="w-[100px] h-[100px] object-cover m-auto rounded-full bg-gray-500" />
        </div>

        <div className="mt-[20px]">
          <p className="text-base font-bold text-center">{ens ? ens : getShortAddress(user?.id)}</p>
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
          <div className="flex justify-between gap-4 ">
            {user?.twitter &&
              <LinkCard
                title="X (Twitter)"
                icon={<Twitter className="m-auto" />}
                link={user?.twitter}
                className="h-min"
              />
            }
            {user?.telegram &&
              <LinkCard
                title="Telegram"
                icon={<Telegram className="m-auto" />}
                link={user?.telegram}
                className="h-min"
              />
            }
          </div>

          <div className="flex justify-between gap-4 mt-[15px]">
            {/* {user?.discord &&
              <LinkCard
                title="Discord"
                icon={<Discord className="m-auto" />}
                link={user?.discord}
                className="h-min"
              />
            } */}
            {user?.linkedin &&
              <LinkCard
                title="Linkedin"
                icon={<Linkedin className="m-auto" />}
                link={user?.linkedin}
                className="h-min"
              />
            }
          </div>
        </div>


        {loggedIn && <div className="flex justify-between gap-4 mt-[50px]">
          <CardButton
            onClick={() => {
              router.push('/edit-profile')
            }}
            title="Edit"
            icon={<Edit className="m-auto" />}
          />
          <CardButton
            onClick={() => disconnect()}
            title="Logout"
            icon={<Rocket className="m-auto" />}
          //loading={loading}
          />
        </div>}
      </div>
    </div>

  )
}