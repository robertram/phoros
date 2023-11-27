import Discord from "./Discord";
import Facebook from "./Facebook";
import Instagram from "./Instagram";
import Telegram from "./Telegram";
import Twitter from "./Twitter";
import Youtube from "./Youtube";

export const getSocialLogo = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <Facebook className="m-auto" />;
    case 'instagram':
      return <Instagram className="m-auto" />;
    case 'twitter':
      return <Twitter className="m-auto" />;
    case 'discord':
      return <Discord className="m-auto" />;
    case 'youtube':
      return <Youtube className="m-auto" />;
    case 'telegram':
      return <Telegram className="m-auto" />;
    default:
      return <Twitter className="m-auto" />;
  }
};