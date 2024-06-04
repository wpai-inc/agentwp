import LogoImg from '@/assets/awp.webp';

export default function Logo( { ...props } ) {
  return <img src={ LogoImg } alt="Agent WP" { ...props } />;
}

export const logoUrl = LogoImg;
