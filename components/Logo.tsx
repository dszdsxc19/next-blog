import type { ComponentProps } from 'react'
import logoAsset from '@/data/logo.svg'

type ImgProps = ComponentProps<'img'>
type LogoProps = Omit<ImgProps, 'src'> & { alt?: string }

const Logo = ({ alt = 'Site logo', ...props }: LogoProps) => (
  <img src={logoAsset.src} width={logoAsset.width} height={logoAsset.height} alt={alt} {...props} />
)

export default Logo
