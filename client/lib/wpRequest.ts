import axios from 'axios';
import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;


const wpRequest = axios.create({
    baseURL: agentwp_settings.rest_route,
    headers: {
        'X-WP-Nonce': agentwp_settings.wp_rest_nonce
    },
    withCredentials: true
});

// add nonce to the request
wpRequest.interceptors.request.use((config) => {
    const nonce = agentwp_settings.wp_rest_nonce;
    if (nonce) {
        config.params = {
            ...config.params,
            agentwp_nonce: nonce,
        };
    }
    return config;
});

export default wpRequest;
