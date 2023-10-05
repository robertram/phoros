import { useState } from "react";
import { AiOutlineUp } from 'react-icons/ai'

interface FooterProps {
  title: string
  faqItems: any
}

export default function FAQ({ title, faqItems }: FooterProps) {
  const [activeItem, setActiveItem] = useState<number>()
  const getGradient = (text: string) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">{text}</span>

  return (
    <div className='w-full max-w-[800px] m-auto mt-[50px] md:mt-[200px] mb-[50px] p-[30px]'>
      <h2 className="text-4xl font-bold mb-[50px] "> {getGradient(title)}</h2>
      <div>
        {faqItems && faqItems.map((item: any, index: number) => {
          return (
            <div className=" pb-[20px]" key={index}>
              <button
                className=" w-full text-left flex justify-between"
                onClick={() => {
                  if (activeItem == index) {
                    setActiveItem(-1)
                  } else {
                    setActiveItem(index)
                  }
                }}>
                <p className="text-xl mb-[10px]">{item.fields.text}</p>
                <AiOutlineUp
                  size={20}
                  className={`${activeItem == index ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`${activeItem == index ? 'block' : 'hidden'}  pb-[20px]`}>
                <p className="text-base font-light">{item.fields.description}</p>
              </div>
              <hr></hr>
            </div>
          )
        })}
      </div>
    </div>
  )
}
