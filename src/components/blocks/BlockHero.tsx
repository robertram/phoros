import React from 'react'
import Hero from '../Landing/Hero'

const BlockHero: React.FC<any> = ({ data }) => {
  const {
    title,
    description,
  } = data.fields

  return (
    <div className='border-solid border-0 border-red-400 md:h-[80vh] flex'>
      <Hero title={title} description={description} />
    </div>
  )
}

export default BlockHero
