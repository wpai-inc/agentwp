import Logo from '@/Components/Logo';

export default function WizardHeader( { children }: { children: React.ReactNode } ) {
  return (
    <div className="text-pretty">
      <Logo className="mx-auto w-14 h-14" />
      <div className="text-4xl font-bold text-center text-brand-dark mb-4 leading-10">
        { children }
      </div>
    </div>
  );
}
