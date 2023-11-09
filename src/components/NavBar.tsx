import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb'
import NotificationsModal from '../components/NotificationsModal'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { ConnectButton } from './ConnectButton'
import { useAuth } from '@/context/AuthContext'
import { AccountButton } from './AccountButton'
import ArrowLeft from '@/icons/ArrowLeft'
import { useRouter } from 'next/router'

interface NavBarProps {
  backButtonText?: string
  backButtonLink?: string
}

const NavBar = ({ backButtonText, backButtonLink }: NavBarProps) => {
  const [showChainAlert, setShowChainAlert] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { address } = useAuth()
  const router = useRouter()

  const headerItems = [
    {
      title: 'Explore',
      link: '/explore'
    },
    {
      title: 'Create List',
      link: '/create-list'
    },
    // {
    //   title: 'Create Event',
    //   link: '/create-event',
    //   loggedIn: true
    // },
  ]

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    if (showMobileMenu && typeof window !== 'undefined' && window.document) {
      document.body.style.overflow = 'hidden';
    }
    if (!showMobileMenu) {
      document.body.style.overflow = 'visible';
    }
  }, [showMobileMenu])

  const desktopMenu = () => {
    return (
      <div className='relative flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
        {backButtonText ?
          <button className='flex' onClick={() => backButtonLink ? router.push(backButtonLink) : {}}>
            <ArrowLeft className="my-auto" />
            <p className='ml-[10px]'>{backButtonText}</p>
          </button>
          :
          <Link href='/' className='flex items-center '>
            <p className='text-3xl font-title'>PHOROS</p>
          </Link>
        }

        {!address ? <ConnectButton /> : <AccountButton />}
      </div>
    )
  }

  return (
    <header>
      <nav className={`border-gray-200 px-4 lg:px-6 py-2.5 ${showMobileMenu ? 'bg-white' : 'bg-transparent'}`}>
        {desktopMenu()}

        <NotificationsModal
          show={showNotifications}
          setShow={() => {
            setShowNotifications(!showNotifications)
          }}
        >
          <div>
            <button
              key={0}
              className='mr-3'
              onClick={() => {
                //if (address) optInChannel(address, {})
              }}
            >
              Subscribe
            </button>
            <button
              key={1}
              onClick={() => {
                //if (address) optOutChannel(address, {})
              }}
            >
              Unsubscribe
            </button>
          </div>
          <div className='h-[600px] overflow-y-auto'>
            {notifications &&
              notifications?.map((oneNotification: any, i: number) => {
                const {
                  cta,
                  title,
                  message,
                  app,
                  icon,
                  image,
                  url,
                  blockchain,
                  secret,
                  notification
                } = oneNotification

                return (
                  <NotificationItem
                    key={`notif-${i}`}
                    notificationTitle={secret ? notification['title'] : title}
                    notificationBody={secret ? notification['body'] : message}
                    cta={cta}
                    app={app}
                    icon={icon}
                    image={image}
                    url={url}
                    theme='dark'
                    chainName={blockchain as chainNameType}
                  />
                )
              })}
          </div>
        </NotificationsModal>


      </nav>
    </header>
  )
}

export default NavBar
