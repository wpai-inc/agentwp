import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class AwpClient {
  private baseUrl: string;
  private token: string;
  private httpClient: AxiosInstance;

  private agentWpVersion = '0.1-alpha1';

  constructor(token: string) {
    this.token = token;
    this.baseUrl = 'http://localhost';

    this.httpClient = axios.create({
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'X-WP-AGENT-VERSION': this.agentWpVersion,
      },
    });
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
  }

  setToken(token: string) {
    this.token = token;
  }
}
