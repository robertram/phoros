interface SelectedPlanProps {
  link?: string
}

export const SelectedPlan = ({ link }: SelectedPlanProps) => {
  return (
    <iframe
      src={link}
      width="600px"
      height="600px"
    //style="max-width:100%;"
    ></iframe>
  )
}