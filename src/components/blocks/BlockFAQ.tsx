import React from 'react'
import FAQ from '../FAQ'

const BlockFAQ: React.FC<any> = ({ data }) => {
  const {
    title,
    questions
  } = data.fields

  return (
    <FAQ title={title} faqItems={questions} />
  )
}

export default BlockFAQ
