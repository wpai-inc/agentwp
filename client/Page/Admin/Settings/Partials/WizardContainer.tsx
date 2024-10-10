import { cn } from '@/lib/utils';

export default function WizardContainer( {
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
} ) {
  // Inject styles into the head
  const injectStyles = () => {
    const style = document.createElement( 'style' );
    style.textContent = `
      body {
        background-color: white !important;
      }
      ul#adminmenu a.wp-has-current-submenu:after,
      ul#adminmenu > li.current > a.current:after {
        border-right-color: white !important;
      }
      #wpcontent {
      padding:10px!important;}
    `;
    document.head.appendChild( style );
  };

  // Call the function to inject styles
  injectStyles();

  return (
    <div
      className={ cn( 'max-w-md mx-auto mt-8 p-8 border rounded-lg border-grey-100', className ) }>
      { children }
    </div>
  );
}
