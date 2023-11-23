import { TokenItemContainer } from "./TokenItemContainer";

interface TokenInfoProps {
  data?: any
}

export const TokenInfo = ({  data }: TokenInfoProps) => {
  return (
    <TokenItemContainer
      title={data.name}
      image={data.image}
      listId={data.listId}
    />
  )
}