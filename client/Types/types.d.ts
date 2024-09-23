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

export type PageData = {
  nonce: string;
  wp_rest_nonce: string;
  rest_route: string;
  rest_endpoint: string;
  admin_route: string;
  home_url: string;
  plugin_url: string;
  api_host: string;
  settings_page: string;
  is_admin: boolean;
  is_connected: boolean;
  onboarding_completed: boolean;
  site_id: string;
  user: WpUser;
  account: {
    user: App.Data.UserData;
    plan: App.Data.PlanData;
    upgrade_link: string;
    config: App.Data.ConfigData;
  };
  account_settings: App.Data.SiteSettingData[];
  general_settings: AgentWpGeneralSettings;
  agentwp_manager: boolean;
  agentwp_users_manager: boolean;
  agentwp_access: boolean;
};

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
