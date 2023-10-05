import { minidenticon } from 'minidenticons'
import { useMemo } from 'react'

export const AvatarGenerator = ({ username, saturation, lightness, ...props }: any) => {
  const svgURI = useMemo(
    () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  )
  return (<img src={svgURI} alt={username} {...props} />)
}