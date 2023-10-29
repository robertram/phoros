import { PoapItemContainer } from "./PoapItemContainer";

interface PoapInfoProps {
  data?: any
}

export const PoapInfo = ({  data }: PoapInfoProps) => {
  return (
    <PoapItemContainer
      title={data.name}
      image={data.image}
      listId={data.listId}
    />
  )
}