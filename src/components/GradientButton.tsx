import React from 'react'
import Link from "next/link"

interface GradientButtonProps {
  children: React.ReactNode
  link?: string
  onClick?: () => void
  className?: string
}

const GradientButton = ({ children, link, onClick, className }: GradientButtonProps) => {
  const gradient = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"

  if (link) {
    return (
      <Link
        href={link}
        className={`py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg cursor-pointer sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 hover:scale-110 transition ease-in-out delay-1000 ${gradient} ${className}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg cursor-pointer sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 hover:scale-110 transition ease-in-out delay-1000 ${gradient} ${className}`}
    >
      {children}
    </button>
  )

}

export default GradientButton
