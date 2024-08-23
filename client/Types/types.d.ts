/// <reference types="vite-plugin-svgr/client" />

export type AWPEventChatSinceType = CustomEvent< { since: string } >;
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
  is_admin: boolean;
  agentwp_manager: boolean;
  agentwp_users_manager: boolean;
  agentwp_access: boolean;
  access_token: string;
  onboarding_completed: boolean;
  general_settings: AgentWpGeneralSettings;
  account_settings: AccountSetting[];
};

export type AccountSetting = {
  name: string;
  value: any;
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
