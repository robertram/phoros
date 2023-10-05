// eslint-disable-next-line
// @ts-ignore

import WhiteLogo from '@/icons/WhiteLogo'
import Link from 'next/link'
import {
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineLinkedin
} from 'react-icons/ai'
import Button from './Button'


const Header = () => {

  const socialItems = [
    {
      title: 'Twitter',
      link: 'https://twitter.com/checkmyticket'
    },
    {
      title: 'Linkedin',
      link: 'https://www.linkedin.com/company/checkmyticket/'
    }
  ]

  const getSocialIcon = (icon: string, className: string) => {
    switch (icon) {
      case 'Facebook':
        return <AiOutlineFacebook
          size={30}
          className={className}
        />
      case 'Twitter':
        return <AiOutlineTwitter
          size={30}
          className={className}
        />
      case 'Instagram':
        return <AiOutlineInstagram
          size={30}
          className={className}
        />
      case 'Linkedin':
        return <AiOutlineLinkedin
          size={30}
          className={className}
        />
      default:
        return ''
    }
  }
  return (
    <header className="bg-none">
      <nav className="mx-auto flex max-w-normal items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex md:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <WhiteLogo className="w-[130px] min-[400px]:w-[180px] md:w-[200px]" />
            {/* <img className="h-16 w-auto" src="/CheckMyTicket.png" alt="" /> */}
          </a>
        </div>
        {/* <div className="flex md:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div> */}
        {/* <div className="hidden md:flex md:gap-x-12">
          <a href="#" className="text-sm font-semibold leading-6 text-white">Features</a>
          <a href="#" className="text-sm font-semibold leading-6 text-white">Marketplace</a>
          <a href="#" className="text-sm font-semibold leading-6 text-white">Company</a>
        </div> */}
        <div className='flex gap-3 items-center justify-center py-3'>
          {/* {socialItems.map((item, index) =>
            <div key={index}>
              <a href={item.link} className="text-sm font-semibold leading-6 text-white" target="_blank" rel="noreferrer">
                {getSocialIcon(item.title, 'cursor-pointer text-white hover:text-[#888] transition-colors duration-300')}
              </a>
            </div>
          )} */}

          <Button link='/explore' className='!m-0 text-xs md:text-base'>Explore Events</Button>

        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-white">Log in <span aria-hidden="true">&rarr;</span></a>
        </div>

        {/* Do not delete */}
        {/* <div>
          <Link href='/explore' className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Go to App</Link>
        </div> */}
      </nav>
      {/* <div className="lg:hidden" role="dialog" aria-modal="true">
        <div className="fixed inset-0 z-10"></div>
        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
            </a>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="-mx-3">
                  <button type="button" className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50" aria-controls="disclosure-1" aria-expanded="false">
                    Product

                    <svg className="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div className="mt-2 space-y-2" id="disclosure-1">
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Analytics!</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Engagement</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Security</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Integrations</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Automations</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Watch demo</a>
                    <a href="#" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Contact sales</a>
                  </div>
                </div>
                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Marketplace</a>
                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</a>
              </div>
              <div className="py-6">
                <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </header>

  )
}

export default Header
