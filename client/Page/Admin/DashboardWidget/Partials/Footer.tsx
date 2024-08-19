type FooterLink = {
  label: string;
  href: string;
};

const links: FooterLink[] = [
  {
    label: 'Blog',
    href: 'https://agentwp.com/blog',
  },
  {
    label: 'Help',
    href: 'https://app.agentwp.com/support',
  },
  {
    label: 'Go Pro',
    href: 'https://app.agentwp.com/enroll/pro',
  },
];

export default function Footer() {
  return (
    <div>
      <ul className="flex divide-x border-t">
        { links.map( ( link, index ) => (
          <li key={ index } className="m-0">
            <a href={ link.href } className="block px-3 py-2">
              { link.label }
            </a>
          </li>
        ) ) }
      </ul>
    </div>
  );
}
