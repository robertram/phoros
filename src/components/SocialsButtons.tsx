import { getSocialLogo } from "@/icons/utils"
import { LinkCard } from "./LinkCard"

interface SocialsButtonsProps {
  socialLinks: any[]
}

export const SocialsButtons = ({ socialLinks }: SocialsButtonsProps) => {

  const generateLink = (item: any) => {
    switch (item.platform) {
      case "twitter":
        return `https://twitter.com/${item.url}`;
      case "discord":
        return item.url;
      case "telegram":
        return `https://twitter.com/${item.url}`;
      case "linkedin":
        return item.url;
      case "Facebook":
        return item.url;
      case "youtube":
        return item.url;
      case "twitch":
        return item.url;
      case "instagram":
        return `https://www.instagram.com/${item.url}`;
      default:
        return "#";
    }
  };

  return (
    <div className="my-[30px]">
      <div className="flex justify-between gap-x-1 gap-y-4 flex-wrap">
        {socialLinks?.length > 0 && socialLinks.map((item, index) => {
          return (
            <LinkCard
              title={item.platform}
              icon={getSocialLogo(item.platform)}
              link={generateLink(item)}
              className="h-min !w-[49%]"
              key={index}
            />
          )
        })}
      </div>
    </div>
  )
}