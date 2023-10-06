import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb'
import * as PushAPI from '@pushprotocol/restapi'
import NotificationsModal from '../components/NotificationsModal'
import { IoIosNotifications } from 'react-icons/io'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { optInChannel } from '@/utils/sendNotification'
import CustomLink from './CustomLink'
import { Login } from './Login'
import { usePaper } from "@/context/PaperContext";
import { checkIsAdmin } from '@/utils/paper'
import WhiteLogo from '@/icons/WhiteLogo'
import { TwitterLogin } from './TwiiterLogin'

const NavBar = () => {
  const [showChainAlert, setShowChainAlert] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { connected, address } = usePaper()

  useEffect(() => {
    // declare the data fetching function
    const fetchNotifications = async () => {
      if (connected && address) {
        const notifications = await PushAPI.user.getFeeds({
          user: `eip155:80001:${address}`, // user address in CAIP
          env: ENV.STAGING
        })
        console.log(address, 'notifications', notifications)

        setNotifications(notifications)
      }
    }

    //   // call the function
    fetchNotifications()
      // make sure to catch any error
      .catch(console.error)
  }, [showNotifications])

  // useEffect(() => {
  //   // declare the data fetching function
  //   const getSubscriptions = async () => {
  //     if (isConnected) {
  //       const subscriptions = await PushAPI.user.getSubscriptions({
  //         user: `eip155:5:${address}`, // user address in CAIP
  //         env: ENV.STAGING
  //       })
  //       console.log('subscriptions', subscriptions)
  //     }
  //   }

  //   // call the function
  //   getSubscriptions()
  //     // make sure to catch any error
  //     .catch(console.error)
  // }, [showNotifications])

  const headerItems = [
    {
      title: 'Explore',
      link: '/explore'
    },
    // {
    //   title: 'Marketplace',
    //   link: '/marketplace'
    // },
    // {
    //   title: 'Create Event',
    //   link: '/create-event',
    //   loggedIn: true
    // },
    {
      title: 'Account',
      link: '/account',
      loggedIn: true
    },
    {
      title: 'Admin',
      link: '/admin',
      isAdmin: true
    },
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
          <p className='text-3xl'>Phoros</p>
        </Link>

        <div className='items-center lg:order-2 hidden md:flex'>
          {address ? (
            <button
              className={`cursor-pointer mr-2 `}
              onClick={() => {
                setShowNotifications(!showNotifications)
              }}
            >
              <IoIosNotifications size={20} />
            </button>
          ) : (
            ''
          )}

          {headerItems.map((item, index) => {
            if (item.loggedIn && !connected) return null
            if (item.isAdmin && !checkIsAdmin()) return null
            return <CustomLink href={item.link} key={index} onClick={() => { setShowMobileMenu(false) }}>{item.title}</CustomLink>
          })}

          <div className='z-50'>
            <TwitterLogin />
            {/* <Login className='!mt-0' /> */}
          </div>

        </div>
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex md:hidden items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>

        {/* {chain?.id !== 11155111 && (
          <div className='h-max p-2 bg-blue-900 absolute right-0 top-[70px] z-50 '>
            Please change your network to Sepolia
          </div>
        )} */}
      </div>
    )
  }

  return (
    <header>
      <nav className={`border-gray-200 px-4 lg:px-6 py-2.5 ${showMobileMenu ? 'bg-white' : 'bg-transparent'}`}>
        {desktopMenu()}

        <div className={`mt-2 absolute z-10 bg-black left-0 justify-between items-center w-full lg:flex lg:w-auto lg:order-1 h-screen ${showMobileMenu ? 'z-20' : 'hidden'}`} id="mobile-menu-2">
          <ul className="pb-2 flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            {headerItems.map((item, index) => {
              if (item.loggedIn && !connected) return null
              if (item.isAdmin && !checkIsAdmin()) return null
              return <CustomLink href={item.link} key={index} onClick={() => { setShowMobileMenu(false) }}>{item.title}</CustomLink>
            })}

            <div className='py-2 px-4 z-50 '>
              {/* <Login /> */}
              <TwitterLogin />
            </div>
          </ul>
        </div>
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
                if (address) optInChannel(address, {})
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
