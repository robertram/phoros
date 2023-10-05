import Link from 'next/link'
import { ReactNode } from 'react';

interface CustomLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void
}

const CustomLink = ({ children, href, className, onClick }: CustomLinkProps) => {
  return (
    <Link
      key={3}
      href={href ? href : '#'}
      className={`text-black hover:text-gray-600 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default CustomLink
