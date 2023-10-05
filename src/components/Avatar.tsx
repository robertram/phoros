interface AvatarProps {
  image?: string
  title?: string
}

export const Avatar = ({ title, image }: AvatarProps) => {
  return (
    <div>
      <p>{title ?? ''}</p>
      {image && <img src={image} alt={title} />}
    </div>
  )
}