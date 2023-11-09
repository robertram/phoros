import { useWeb3Modal } from '@web3modal/wagmi/react'

interface ConnectButtonProps {
  text?: string
}

export const ConnectButton = ({ text = 'Log In' }: ConnectButtonProps) => {
  const { open, close } = useWeb3Modal()

  return (
    <button
      onClick={() => {
        open({ view: 'Connect' })
      }}
      className='!bg-primary rounded-[8px] text-white p-[10px] px-[20px] cursor-pointer'
    >{text}</button>
  )
}