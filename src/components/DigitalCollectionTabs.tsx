interface DigitalCollectionTabsProps {
  tabs: any
  activeTab: number
  setActiveTab: (tabIndex: number) => void
}

export const DigitalCollectionTabs = ({ tabs, activeTab, setActiveTab }: DigitalCollectionTabsProps) => {
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-[20px]">
      <ul className="flex flex-wrap -mb-px bg-[#F5F5F5] rounded-[50px] w-full border-gray-border border-2 border-solid">
        {tabs && tabs.map((item: string, index: number) => {
          return (
            <li className="w-[50%]" onClick={(e) => {
              e.preventDefault()
              setActiveTab(index)
            }} key={index}>
              <button
                className={`inline-block p-2 md:p-4 w-[100%]
            ${activeTab === index ? 'text-blue-600 rounded-[50px] bg-white active shadow-box' : 'text-black'}
            `}>{item}</button>
            </li>
          )
        })}
      </ul>
    </div>


  )
}