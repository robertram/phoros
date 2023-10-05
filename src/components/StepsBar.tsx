
interface StepsBarProps {
  steps: any
  currentStep: number
  setStep: (step: number) => void
}

interface StepProps {
  title: string
  description: string
  itemStep: number
  onClick: () => void
}

export const StepsBar = ({ steps, currentStep, setStep }: StepsBarProps) => {

  const Step = ({ title, description, itemStep, onClick }: StepProps) => {
    const completedClass = "border-indigo-600 hover:border-indigo-800"
    const nonCompletedClass = "border-gray-200 hover:border-gray-300"

    const textCompletedClass = "text-indigo-600 group-hover:text-indigo-800"
    const textNonCompletedClass = "text-gray-500 group-hover:text-gray-700"

    return (
      <li className="md:flex-1">
        <button
          onClick={() => onClick()}
          className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 w-full text-left ${itemStep <= currentStep ? completedClass : nonCompletedClass}`}
        >
          <span className={`text-sm font-medium ${itemStep <= currentStep ? textCompletedClass : textNonCompletedClass}`}>{title}</span>
          <span className="text-sm font-medium">{description}</span>
        </button>
      </li>
    )
  }


  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        <div className="p-6 w-full overflow-hidden rounded-lg border-solid border-slate-600 border-2 mt-4">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">

              {steps.map((item: any, index: number) => (
                <Step title={`Step ${index + 1}`} description={item} onClick={() => { setStep(index + 1) }} itemStep={index + 1} key={index} />
              ))}

              {/* <Step title="Step 1" description="Event Information" onClick={() => { setStep(1) }} itemStep={1} />
              <Step title="Step 2" description="Ticket Information" onClick={() => { setStep(2) }} itemStep={2} />
              <Step title="Step 3" description="Preview Event Info" onClick={() => { setStep(3) }} itemStep={3} /> */}
            </ol>
          </nav>
        </div>
      </div>
    </div>

  )
}