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
  page: string;
  url: string;
  notice_visible: string;
  home_url: string;
  plugin_url: string;
  settings_page: string;
  admin_route: string;
  nonce: string;
  wp_rest_nonce: string;
  site_id: string;
  client_id: string;
  api_host: string;
  rest_route: string;
  rest_endpoint: string;
  user: WpUser;
  account: {
    user: UserData;
    plan: PlanData;
    upgrade_link: string;
    config: ConfigData;
  };
  is_admin: boolean;
  agentwp_manager: boolean;
  agentwp_users_manager: boolean;
  agentwp_access: boolean;
  access_token: string;
  onboarding_completed: boolean;
  general_settings: AgentWpGeneralSettings;
  account_settings: SiteSettingData[];
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

type SelectedInputType = {
  inputPath: string;
  inputXPath: string;
  inputLabel: string;
  inputName: string | null;
  inputId: string | null;
  inputValue: string | null;
};

type StreamableFieldType = {
  type: string;
  data: SelectedInputType | null;
};

type AgentWpGeneralSettings = {
  cleanup_after_deactivate: boolean;
};

/** Copied from awp/resources/js/types/generated.d.ts */
export type HistoryData = {
  conversationId: number;
  userRequestId: number;
  siteId: string;
  userId: number;
  wpUserId: number;
  message: string;
  conversationCreatedAt: string;
  userRequestCreatedAt: string;
  humanCreatedAt: string;
};

export type PlanData = {
  name: string;
  slug: string;
  priceYearly: number;
  priceMonthly: number;
};

export type SiteSettingValue = 'convoOnly' | 'webEnabled' | 'visionEnabled';

export type SiteSettingData = {
  name: SiteSettingValue;
  value: any;
  label: string;
};

export type ConfigData = {
  abilities: [];
  context_awareness: [];
  capabilities: [];
  convo_only: boolean;
  convo_disabled: boolean;
  token_limit: number;
  token_limit_per_site: number;
  token_limit_per_user: number;
};

export type UserData = {
  name: string;
  email: string;
  email_verified_at: string;
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
