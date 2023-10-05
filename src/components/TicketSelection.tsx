
interface TicketSelectionProps {
  value: any
  onClickMore: () => void
  onClickLess: () => void
  disabledMore?: boolean
  disabledLess?: boolean
}

export const TicketSelection = ({ value, onClickMore, onClickLess, disabledMore, disabledLess }: TicketSelectionProps) => {

  const CustomButton = ({ left, children, onClickMore, onClickLess }: any) => {
    // return (
    //   <button
    //     className={`bg-green-400 p-3 text-black ${left ? '' : ''} `}
    //     onClick={left ? onClickLess : onClickMore}
    //   >{children}</button>
    // )

    return (
      <button
        disabled={left ? disabledLess : disabledMore}
        onClick={left ? onClickLess : onClickMore}
        className={`flex justify-center text-2xl w-[50px] text-white 
        bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
        focus:ring-blue-300 font-medium rounded-lg p-2.5 text-center items-center mr-2 
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 
        ${disabledMore && !left ? '!bg-gray-500' : ''}
        ${disabledLess && left ? '!bg-gray-500' : ''}
        `}>
        {/* <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg> */}
        {children}
      </button>


    )
  }



  return (
    <div className="flex ">
      <CustomButton left onClickLess={onClickLess}>-</CustomButton>
      <p className="p-2 my-auto text-xl">{value}</p>
      <CustomButton onClickMore={onClickMore}>+</CustomButton>
    </div>
  )
}