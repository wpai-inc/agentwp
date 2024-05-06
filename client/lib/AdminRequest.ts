import axios from 'axios';

declare const ajaxurl: string;
declare const agentwp_settings: agentwpSettings;


const adminRequest = axios.create({
    baseURL: ajaxurl,
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
