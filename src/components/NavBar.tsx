import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb'
import NotificationsModal from '../components/NotificationsModal'

const NavBar = () => {
  const [showChainAlert, setShowChainAlert] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

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
        <Link href='/' className='flex items-center '>
          <p className='text-3xl font-semibold'>Phoros</p>
        </Link>

        <w3m-button size='md' label='Log In' />
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
