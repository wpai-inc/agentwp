import axios, { AxiosInstance, AxiosResponse } from 'axios';

import type { PageData } from '@/Types/types';
import { usePage } from '@/Providers/PageProvider';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { useNotificationsContext } from '@/Providers/useNotificationsContext';


export default class AwpClient {
  private baseUrl: string = 'https://api.agentwp.com';
  private token?: string;
  private httpClient: AxiosInstance;

  private agentWpVersion = '0.1-alpha1';

  constructor(token?: string) {

    const page = usePage();
    const { addNotification } = useNotificationsContext();
    const adminRequest = useAdminRoute();
    this.token = token || page.access_token;
    this.baseUrl = page.api_host;


    this.httpClient = axios.create({
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'X-WP-AGENT-VERSION': this.agentWpVersion,
      },
    });

    this.httpClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Logout user or redirect to login page
          addNotification(
            'Your API token is invalid or expired. Please login again.',
            'error',
          );
          adminRequest.get('/agentwp/v1/logout');
          throw new Error(
            'Your API token is invalid or expired. Please login again.',
          );
        }
        return Promise.reject(error);
      },
    );
  }

  isAuthorized() {
    if (!this.token) {
      return null;
    }
    return this;
  }

  getStreamUrl(userRequestId: string) {
    return `${this.baseUrl}/api/request/${userRequestId}/stream`;
  }

  async getConversation(siteId: string): Promise<AxiosResponse> {
    return this.request('GET', `${this.baseUrl}/api/sites/${siteId}`);
  }

  async storeAgentResult(
    actionId: string,
    data: object,
  ): Promise<AxiosResponse> {
    return this.request(
      'POST',
      `${this.baseUrl}/api/action/${actionId}/result`,
      {},
      data,
    );
  }

  async storeConversation(
    siteId: string,
    data: object,
  ): Promise<AxiosResponse> {
    return this.request(
      'POST',
      `${this.baseUrl}/api/sites/${siteId}`,
      {},
      data,
    );
  }

  request(
    method: string,
    url: string,
    params: object = {},
    data: object = {},
    additionalHeaders: object = {},
  ): Promise<AxiosResponse> {
    if (!this.token) {
      return Promise.reject(new Error('Token is undefined or empty'));
    }

    return this.httpClient.request({
      method,
      url,
      params,
      data,
      headers: additionalHeaders,
    });
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  setToken(token: string) {
    this.token = token;
  }
}
