import { getSocialLogo } from "@/icons/utils"
import { LinkCard } from "./LinkCard"

interface SocialsButtonsProps {
  socialLinks: any[]
}

export const SocialsButtons = ({ socialLinks }: SocialsButtonsProps) => {
  return (
    <div>
      <div className="mt-[30px]">
        <div className="flex justify-between gap-x-1 gap-y-4 flex-wrap">
          {socialLinks?.length > 0 && socialLinks.map((item, index) => {
            return (
              <LinkCard
                title={item.platform}
                icon={getSocialLogo(item.platform)}
                link={item?.url ?? '#'}
                className="h-min !w-[49%]"
                key={index}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}