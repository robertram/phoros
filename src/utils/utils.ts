export const getFormattedLocation = (text: string) => {
  const location = text.split(/[,]/);
  return location[0].trim();
}
export const limitStringTo200Characters = (inputString: string) => {
  if (inputString?.length <= 100) {
    return inputString;
  } else {
    return inputString?.substring(0, 100) + '...';
  }
}

export const removeAtSymbol = (inputString: string) => {
  if (inputString.includes("@")) {
    return inputString.replace("@", "");
  } else {
    return inputString;
  }
}

export const generateSocialLinks = (listInfo: any, existingLinks: any) => {
  const platforms = ['facebook', 'instagram', 'twitter', 'discord', 'youtube', 'telegram'];

  const linkExists = (platform: any, url: any) => existingLinks.some((link: any) => link?.platform === platform && link?.url === url);

  return platforms.reduce((accumulatedLinks: any, platform) => {
    const url = listInfo[platform];
    if (url && !linkExists(platform, url)) {
      accumulatedLinks.push({ platform, url });
    }
    return accumulatedLinks;
  }, []);
};

export const getWhereParam = (addressParam: string) => {
  let result;

  switch (true) {
    case addressParam?.includes('.eth'):
      result = "ens";
      break;
    case addressParam === undefined || addressParam === null:
      result = "username";
      break;
    default:
      result = addressParam?.startsWith('0x') ? "id" : "username";
      break;
  }
  return result
}