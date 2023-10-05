import {
  AiOutlineMedium,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineLinkedin,
  AiOutlineGithub,
  AiOutlineFileText
} from 'react-icons/ai'

export const getSocialIcon = (icon: string, className: string) => {
  switch (icon) {
    case 'Medium':
      return <AiOutlineMedium
        size={20}
        className={className}
      />
    case 'Facebook':
      return <AiOutlineFacebook
        size={20}
        className={className}
      />
    case 'Twitter':
      return <AiOutlineTwitter
        size={20}
        className={className}
      />
    case 'Instagram':
      return <AiOutlineInstagram
        size={20}
        className={className}
      />
    case 'Linkedin':
      return <AiOutlineLinkedin
        size={20}
        className={className}
      />
    case 'Github':
      return <AiOutlineGithub
        size={20}
        className={className}
      />
    case 'Whitepaper':
      return <AiOutlineFileText
        size={20}
        className={className}
      />

    default:
      return ''
  }
}