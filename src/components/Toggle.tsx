
interface ToggleProps {
  name: string
  checked?: boolean
  onChange?: (event: any) => void
  disabled?: boolean
  bgColor?: string
}

export const Toggle = ({ name, checked, onChange, disabled, bgColor }: ToggleProps) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer h-min">
      <input id={name} name={name} type="checkbox" checked={checked} disabled={disabled} value="" className="sr-only peer" onChange={onChange} />
      <div className={`w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E5E5] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${bgColor}`}></div>
      {/* <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span> */}
    </label>
  )
}