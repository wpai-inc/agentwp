import LogoImg from '@/assets/awp.webp';

export default function Logo( { ...props } ) {
  return <img src={ LogoImg } alt="AgentWP" { ...props } />;
}

export const logoUrl = LogoImg;
