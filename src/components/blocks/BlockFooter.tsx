import React from 'react'
import Footer from '../Footer'

const BlockFooter: React.FC<any> = ({ data }) => {
  const {
    newsletterDescription,
    newsletterCtaText,
    newsletterConcentText,
    copyrightText,
    socialLinks,
    otherLinks
  } = data.fields

  return (
    <Footer
      newsletterDescription={newsletterDescription}
      newsletterCtaText={newsletterCtaText}
      newsletterConcentText={newsletterConcentText}
      copyrightText={copyrightText}
      socialLinks={socialLinks}
      otherLinks={otherLinks}
    />
  )
}

export default BlockFooter
