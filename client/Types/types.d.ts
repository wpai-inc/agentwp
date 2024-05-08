type agentwpSettings = {
  nonce: string;
  site_id: string;
  client_id: string;
  api_host: string;
  user: {
    ID: string;
    display_name: string;
    user_activation_key: string;
    user_email: string;
    user_login: string;
    user_nicename: string;
    user_pass: string;
    user_registered: string;
    user_status: string;
    user_url: string;
  };
  is_admin: boolean;
  agentwp_manager: boolean;
  agentwp_users_manager: boolean;
  agentwp_access: boolean;
  access_token: {
    access_token: string;
    expires_at: number;
    refresh_token: string;
  };
};
