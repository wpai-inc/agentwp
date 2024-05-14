import axios from 'axios';
import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;


const adminRequest = axios.create({
    baseURL: agentwp_settings.rest_route + 'agentwp/v1/',
    headers: {
        'X-WP-Nonce': agentwp_settings.wp_rest_nonce
    }
});

// add nonce to the request
adminRequest.interceptors.request.use((config) => {
    const nonce = agentwp_settings.nonce;
    if (nonce) {
        config.params = {
            ...config.params,
            agentwp_nonce: nonce,
        };
    }
    return config;
});

export default adminRequest;
