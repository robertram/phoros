interface PlanPickerProps {
  plans: any
  onClick: (index: number) => void
  selectedPlan: number
}

export const PlanPicker = ({ plans, onClick, selectedPlan }: PlanPickerProps) => {

  console.log('plans', plans);
  
  return (
    <div>
      {plans && plans?.map((item: any, index: number) => {
        return (
          <div
            className={`border-solid border-2 border-gray-300 p-[20px] w-full cursor-pointer ${selectedPlan === index ? 'border-green-500' : ''}`}
            key={index}
            onClick={() => {
              onClick(index)
            }}
          >
            <p className="w-full">{item.name}</p>
          </div>
        )
      })}
    </div >
  )
}