import Image from "next/image"
import Link from "next/link"
import GradientButton from "./GradientButton"
import { RichText } from "./RichText"

interface TextButtonSectionProps {
  title: string
  description: string
  image: any
  CTAtext: string
  CTAlink: string
  isLeftAligned: boolean
}

const TextButtonSection = ({ title, description, image, CTAtext, CTAlink, isLeftAligned }: TextButtonSectionProps) => {
  return (
    <div className={`h-auto md:h-[600px] py-[20px] max-w-normal !m-auto w-full p-[30px] !mt-[40px] flex flex-col-reverse md:flex-row ${isLeftAligned ? '!md:flex-row-reverse flex-col' : ''} `}>
      <div className="text w-full md:w-[50%] flex">
        <div className="my-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 max-w-[350px]">{title}</h2>
          <p className="text-base  mb-4 max-w-[350px]">{description}</p>
          {CTAlink && <GradientButton link={CTAlink}>{CTAtext}</GradientButton>}
        </div>
      </div>

      <div className={`image mb-[20px] md:mb-[0] w-full md:w-[50%] flex ${isLeftAligned ? 'mr-[50px]' : ''}`}>
        <Image
          className="m-auto"
          src={`https:${image?.fields?.file.url}`}
          alt={title}
          width={600}
          height={600} />
      </div>

    </div>
  )
}
export default TextButtonSection