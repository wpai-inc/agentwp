/// <reference types="vite-plugin-svgr/client" />

export type AWPEventChatSinceType = CustomEvent;
export type AWPEventChatOpenType = CustomEvent;
export type AWPRootType = HTMLElement & {
  listener: ( this: Window, ev: AWPEventChatSinceType ) => any;
  dispatchEvent: ( event: Event ) => boolean;
  addEventListener: (
    type: string,
    listener: ( this: Window, ev: AWPEventChatSinceType ) => any,
  ) => void;
};

export type WpResponse< T = any > = {
  success: boolean;
  data: T;
  message?: string;
};

export interface PageData {
  nonce: string;
  wp_rest_nonce: string;
  rest_route: string;
  rest_endpoint: string;
  admin_route: string;
  home_url: string;
  plugin_url: string;
  api_host: string;
  settings_page: string;
  is_admin: string;
  is_connected: string;
  onboarding_completed: string;
  site_id: string;
  user: WpUser;
  account_settings: App.Data.SiteSettingData[];
  general_settings: AgentWpGeneralSettings;
  agentwp_manager: string;
  agentwp_users_manager: string;
  agentwp_access: string;
  locale: string;
  lang: string;
  translations: Array< string >;
}

export interface SettingsPageData extends PageData {
  site_title: string;
  site_icon_url: string;
  plans: App.Data.PlanData[];
}

export type WpUser = {
  ID: string;
  display_name: string;
  user_email: string;
  user_login: string;
  user_nicename: string;
  avatar_url: string;
  roles: string[];
};

export type AgentWpUser = {
  id: number;
  name: string;
  email: string;
  manage_agentwp_users: boolean;
  agentwp_access: boolean;
  is_current_user: boolean;
  image: string;
  role: string;
};

export type BlockType = {
  name: string;
  clientId: string;
  attributes: {
    content?: string;
  };
  innerBlocks?: BlockType[];
  status?: string;
  valid?: boolean;
};

export type GutenbergStreamType = {
  content: BlockType[];
  summary: string;
};

type AgentWpGeneralSettings = {
  cleanup_after_deactivate: boolean;
  keyboard_shortcuts: boolean;
  restricted_urls: string;
};

export type WpPost = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    footnotes: string;
  };
  categories: number[];
  tags: number[];
};
