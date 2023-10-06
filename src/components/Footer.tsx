
import { getSocialIcon } from '@/icons/icons'
import WhiteLogo from '@/icons/WhiteLogo'
import FooterMailchimpNewsletter from './FooterMailchimpNewsletter'

interface FooterProps {
  newsletterDescription: string
  newsletterCtaText: string
  newsletterConcentText: string
  copyrightText: string
  socialLinks: any
  otherLinks: any
}

export default function Footer({ newsletterDescription, newsletterCtaText, newsletterConcentText, copyrightText, socialLinks, otherLinks }: FooterProps) {

  const footerItems = [
    {
      title: 'Privacy',
      link: '/privacy'
    },
    {
      title: 'Terms',
      link: '/terms'
    }
  ]


  return (
    <section className='w-full p-[30px] md:px-[60px] md:py-[80px] mt-[50px]'>
      <div className="flex md:flex-row flex-col border-gray-500 border-t-2 border-solid md:border-0">
        <div className='newsletter w-full md:w-[40%]'>
            <WhiteLogo className="w-[200px] mb-[10px]" />
          <p className='text-base mb-[20px]'>{newsletterDescription}</p>
          <FooterMailchimpNewsletter />

          <p className='text-xs mt-[20px] md:mt-[0px] mb-[20px]'>{newsletterConcentText}</p>
        </div>

        <div className="links flex md:flex-row flex-col w-full md:w-[60%] py-[20px] md:p-[20px]">

          {/* <div className="pl-[100px] w-full">
            {otherLinks && otherLinks.map((item: any, index: number) =>
              <a key={index} href={item.fields.link} target="_blank" rel="noreferrer" title={item.fields.text} className="flex hover:underline hover:text-[#888]">
                <span className='ml-2 my-auto'>{item.fields.text}</span>
              </a>
            )}
          </div> */}

          <div className="w-full md:w-[50%]"></div>

          <div className='w-full md:w-[50%] md:selection:pl-[100px] social-media'>
            <p className='text-base font-bold mb-[20px]'>Follow Us</p>
            {socialLinks && socialLinks.map((item: any, index: number) =>
              <a key={index} href={item.fields.link} target="_blank" rel="noreferrer" title={item.fields.text} className="flex hover:underline hover:text-[#888] mb-[10px]">
                {getSocialIcon(item.fields.text, 'cursor-pointer text-white  transition-colors duration-300')}
                <span className='ml-2 my-auto'>{item.fields.text}</span>
              </a>
            )}
          </div>
        </div>

      </div>
      <hr className='w-full mt-[30px]' />
      <div className=''>
        <p className='text-xs mt-[20px]'>{copyrightText}</p>
      </div>
    </section >
  )
}
