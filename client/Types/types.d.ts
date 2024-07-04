/// <reference types="vite-plugin-svgr/client" />

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
