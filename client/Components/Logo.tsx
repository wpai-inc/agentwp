import { usePage } from "@/Providers/PageProvider";

export function Logo({ ...props }) {
    const page = usePage();
    return (
        <img
            {...props}
            src={page.plugin_url + "/assets/images/awp.png"}
            alt="Agent WP"
        />
    );
}
