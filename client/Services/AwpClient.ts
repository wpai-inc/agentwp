import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { agentwpSettings } from "@/Types/types";
declare const agentwp_settings: agentwpSettings;

export default class AwpClient {
  private baseUrl: string;
  private token?: string;
  private httpClient: AxiosInstance;

  private agentWpVersion = '0.1-alpha1';

  constructor() {
    this.token = agentwp_settings.access_token;
    this.baseUrl = agentwp_settings.api_host;

    //TODO: if this.token is undefined, throw an error


    this.httpClient = axios.create({
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'X-WP-AGENT-VERSION': this.agentWpVersion,
      },
    });
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
}
