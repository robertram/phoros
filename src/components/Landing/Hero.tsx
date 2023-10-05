import MailchimpNewsletter from "../MailchimpNewsletter"
import { RichText } from "../RichText"

interface HeroProps {
  title?: string
  description?: string
}

const Hero = ({ title, description }: HeroProps) => {
  const getGradient = (text: string) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">{text}</span>

  return (
    <div className="p-6 m-auto">
      <div className="text-center ">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">Buy your  {getGradient('event tickets')}</h1>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
          {getGradient('Safer')} than ever</h1>

        <p className="text-xl text-gray-400 mb-8">{description}</p>
      </div>
      <MailchimpNewsletter />
    </div>
  )
}
export default Hero