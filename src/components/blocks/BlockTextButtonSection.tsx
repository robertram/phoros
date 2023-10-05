import React from 'react'
import TextButtonSection from '../TextButtonSection'

const BlockTextButtonSection: React.FC<any> = ({ data }) => {
  const {
    title,
    description,
    image,
    ctaText,
    ctaLink, 
    isLeftAligned
  } = data.fields

  return (
    <TextButtonSection
      title={title}
      description={description}
      image={image}
      CTAtext={ctaText}
      CTAlink={ctaLink}
      isLeftAligned={isLeftAligned}
    />
  )
}

export default BlockTextButtonSection
