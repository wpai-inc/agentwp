type agentwpSettings = {
    nonce: string;
    site_id: string;
    client_id: string;
    api_host: string;
    user_email: string;
    is_admin: boolean;
    agentwp_manager: boolean;
    agentwp_users_manager: boolean;
    agentwp_access: boolean;
    access_token: {
        access_token: string;
        expires_at: number;
        refresh_token: string;
    };
}
