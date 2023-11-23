interface TabsProps {
  tabs: any
  activeTab: number
  setActiveTab: (tabIndex: number) => void
}

export const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {tabs && tabs.map((item: string, index: number) => {
          return (
            <li className="mr-2" onClick={(e) => {
              e.preventDefault()
              setActiveTab(index)
            }} key={index}>
              <button
                className={`inline-block p-2 md:p-4 border-b-2 border-transparent rounded-t-lg 
            ${activeTab === index ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 '}
            `}>{item}</button>
            </li>
          )
        })}
      </ul>
    </div>


  )
}