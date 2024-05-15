import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;
interface LogoProps {
    className: string | undefined
}

export function Logo({ className }: LogoProps) {
  return (
        <img className={className} src={agentwp_settings.plugin_url + '/assets/images/awp.png'} alt="Agent WP" />
  );
}
