import ConnectButton from '@/Page/Admin/Settings/Partials/ConnectButton';
import { ManualAwpActivation } from '@/Page/Admin/Settings/Partials/ManualAwpActivation';
import { usePage } from '@/Providers/PageProvider';
import { SettingsPageData } from '@/Types/types';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';

export default function ConnectAiService() {
  const { page } = usePage< SettingsPageData >();

  return (
    <WizardContainer>
      <WizardHeader>Connect { page.site_title } Site to AgentWP Services</WizardHeader>
      <div className="text-brand-gray-70">
        <p className="text-lg mt-4">
          To begin using AgentWP, connect it to the Al services. If this is your first time
          connecting this site, a quick indexing process will take place.
        </p>
        <div className="bg-gray-200 rounded-xl p-6 text-base mt-4">
          <h3 className="text-xl text-center">AgentWP will be able to see the following:</h3>
          <ul className="mt-6 space-y-6">
            <FeatureList
              icon={ <IconPlugin /> }
              title="Active Plugins and Themes"
              items={ [ 'codebases', 'a list of active plugins' ] }
            />
            <FeatureList
              icon={ <IconDb /> }
              title="Database"
              items={ [ 'database structure', 'database content (encrypted)' ] }
            />
            <FeatureList title="Site Health" icon={ <IconHealth /> } />
          </ul>
        </div>
        <p className="mt-4">
          Your data is private. It will never be used for AI training, and is encrypted at rest and
          transit.
        </p>
        <div className="mt-4">
          <ConnectButton />
          <ManualAwpActivation />
        </div>
        <div className="mt-4 text-sm">
          By connecting, you agree to the{ ' ' }
          <a href="https://agentwp.com/legal/terms/" target="_blank" className="underline">
            Terms
          </a>{ ' ' }
          and{ ' ' }
          <a href="https://agentwp.com/legal/privacy/" target="_blank" className="underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </WizardContainer>
  );
}

function FeatureList( {
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items?: string[];
} ) {
  return (
    <li>
      <div className="flex gap-4 items-start mx-auto">
        <div className="w-12 flex items-center justify-center">{ icon }</div>
        <div className="space-y-2 text-brand-dark/70">
          <h4 className="font-bold">{ title }</h4>
          { items && (
            <ul className="list-disc space-y-0.5 ml-4">
              { items.map( i => (
                <li>{ i }</li>
              ) ) }
            </ul>
          ) }
        </div>
      </div>
    </li>
  );
}

function IconPlugin() {
  return (
    <svg
      width="37"
      height="37"
      className="pt-2"
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.5"
        d="M34.9057 10.77C36.3019 12.1596 36.3019 14.4178 34.9057 15.6338L30.0189 20.4977L16.4057 6.94836L21.2925 2.08451C22.6887 0.694836 24.9575 0.694836 26.1792 2.08451L29.3208 5.21127L34.5566 0L37 2.43193L31.7642 7.64319L34.9057 10.77ZM24.783 20.8451L22.3396 18.4131L17.4528 23.277L13.7877 19.6291L18.6745 14.7653L16.2311 12.3333L11.3443 17.1972L8.72641 14.7653L3.83962 19.6291C2.4434 21.0188 2.4434 23.277 3.83962 24.493L6.98113 27.6197L0 34.5681L2.4434 37L9.42453 30.0516L12.566 33.1784C13.9623 34.5681 16.2311 34.5681 17.4528 33.1784L22.3396 28.3146L19.8962 25.8826L24.783 20.8451Z"
        fill="black"
      />
    </svg>
  );
}

function IconHealth() {
  return (
    <svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.5"
        d="M13.6 3.4H10.2L8.5 0H15.3L13.6 3.4ZM15.3 10.2V6.8H17V5.1H6.8V6.8H8.5V10.2C3.808 10.2 0 14.008 0 18.7V34H23.8V18.7C23.8 14.008 19.992 10.2 15.3 10.2ZM18.7 25.5H13.6V30.6H10.2V25.5H5.1V22.1H10.2V17H13.6V22.1H18.7V25.5Z"
        fill="black"
      />
    </svg>
  );
}

function IconDb() {
  return (
    <svg
      width="34"
      height="34"
      className="pt-2"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.5"
        d="M0 15.3V10.2C0 13.94 6.4421 17 14.3158 17C22.1895 17 28.6316 13.94 28.6316 10.2V15.3C28.6316 16.15 28.2737 16.83 27.7368 17.68C26.3053 17.17 24.8737 17 23.2632 17C18.7895 17 14.4947 18.87 11.8105 21.93C5.01053 21.42 0 18.7 0 15.3ZM14.3158 13.6C22.1895 13.6 28.6316 10.54 28.6316 6.8C28.6316 3.06 22.1895 0 14.3158 0C6.4421 0 0 3.06 0 6.8C0 10.54 6.4421 13.6 14.3158 13.6ZM9.12632 28.39L8.58947 27.2L9.12632 26.01C9.30526 25.67 9.48421 25.5 9.48421 25.16C3.93684 24.14 0 21.76 0 18.7V23.8C0 26.86 4.29474 29.41 10.2 30.26C9.8421 29.75 9.48421 29.07 9.12632 28.39ZM23.2632 25.5C22.1895 25.5 21.4737 26.18 21.4737 27.2C21.4737 28.22 22.1895 28.9 23.2632 28.9C24.3368 28.9 25.0526 28.22 25.0526 27.2C25.0526 26.18 24.3368 25.5 23.2632 25.5ZM34 27.2C32.3895 31.11 28.0947 34 23.2632 34C18.4316 34 14.1368 31.11 12.5263 27.2C14.1368 23.29 18.4316 20.4 23.2632 20.4C28.0947 20.4 32.3895 23.29 34 27.2ZM27.7368 27.2C27.7368 24.82 25.7684 22.95 23.2632 22.95C20.7579 22.95 18.7895 24.82 18.7895 27.2C18.7895 29.58 20.7579 31.45 23.2632 31.45C25.7684 31.45 27.7368 29.58 27.7368 27.2Z"
        fill="black"
      />
    </svg>
  );
}
