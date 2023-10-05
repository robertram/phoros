export const getFormattedLocation = (text: string) => {
  const location = text.split(/[,]/);
  return location[0].trim();
}