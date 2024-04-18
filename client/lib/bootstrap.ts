export type Page = {
  nonce: string;
  ajax_url: string;
  page: string;
  notice_visible: boolean;
};

export default function setup(slug: string) {
  const id = `agent-wp-${slug.replace(/\//g, '-')}`;
  const page_var = id.replace(/-/g, '_');
  const rootElement = document.getElementById('agent-wp-admin-settings');
  const page = (window as any)[page_var] as Page;
  return { rootElement, page };
}
