import axios from "axios";
import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;

const apiRequest = axios.create({
    baseURL: agentwp_settings.api_host,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${agentwp_settings.access_token}`
    }
});

apiRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("You need to login to access this page.");
        }
        return Promise.reject(error);
    }
);

export default apiRequest;
