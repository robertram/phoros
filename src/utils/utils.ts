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