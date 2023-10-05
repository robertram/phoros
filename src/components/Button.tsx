import { useRouter } from 'next/router';

interface ButtonProps {
  children: any
  link?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  secondary?: boolean
}

const Button = ({ children, link, onClick, disabled, className, secondary }: ButtonProps) => {
  const router = useRouter();

  const secondaryStyle = `border-solid border-white border-2 px-[20px] py-[10px] rounded-md ${className}`

  return (
    <button
      disabled={disabled}
      className={secondary ? secondaryStyle :
        `mt-[20px] w-full rounded-md bg-custom-purple px-[20px] py-[10px] hover:bg-custom-purple ${className}`}
      onClick={() => {
        if (link) router.push(link)
        else if (onClick) { onClick() }
      }}
    >{children}</button>
  );
}

export default Button