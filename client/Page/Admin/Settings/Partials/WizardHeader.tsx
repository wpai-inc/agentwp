import Logo from '@/Components/Logo';
export default function WizardHeader( {
  siteIcon,
  message,
}: {
  siteIcon?: string;
  message: string;
} ) {
  return (
    <div className="text-pretty">
      <div className="flex justify-start items-center mb-4">
        { siteIcon && <img src={ siteIcon } alt="Site Icon" className="w-14 h-14 -mr-4" /> }
        <Logo className="w-14 h-14 rounded-full bg-white" />
      </div>
      <div className="text-4xl font-semibold text-left text-brand-dark mb-4 leading-10">
        { message }
      </div>
    </div>
  );
}
