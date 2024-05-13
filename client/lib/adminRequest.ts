import axios from 'axios';
import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;


const adminRequest = axios.create({
    baseURL: '/?rest_route=/agentwp/v1/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// add nonce to the request
adminRequest.interceptors.request.use((config) => {
    const nonce = agentwp_settings.nonce;
    if (nonce) {
        config.params = {
            ...config.params,
            nonce,
        };
    }
    return config;
});

export default adminRequest;
