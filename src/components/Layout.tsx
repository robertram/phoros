import { HTMLAttributes, useEffect, useState } from 'react'
import Footer from './Footer'
import NavBar from './NavBar'
import { useRouter } from 'next/router'
import SEO from './SEO'
import { FloatingButton } from './FloatingButton'

interface Props extends HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  hideNavbar?: boolean
  backButtonText?: string
  backButtonLink?: string
}

interface LayoutProps {
  title?: string
  description?: string
}

export default function Layout({ ...props }: Props) {
  const router = useRouter()
  const { title, description, hideNavbar, backButtonText, backButtonLink } = props;

  return (
    <>
      <SEO title={title ? `${title} | Phoros` : 'Phoros'} description={description} />
      {!hideNavbar && <NavBar backButtonText={backButtonText} backButtonLink={backButtonLink} />}
      <main className='min-h-[71vh]' {...props} />

      {/* <FloatingButton/> */}
      {/* {firstRoute === '' || firstRoute === 'landing' ? '' :
        <Footer
          newsletterDescription={newsletterDescription}
          newsletterCtaText={newsletterCtaText}
          newsletterConcentText={newsletterConcentText}
          copyrightText={copyrightText}
          socialLinks={socialLinks}
          otherLinks={otherLinks}
        />
      } */}
    </>
  )
}
