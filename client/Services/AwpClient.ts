import axios, { AxiosInstance } from 'axios';

export default class AwpClient {
  private token: string;
  private siteId: string;
  private httpClient: AxiosInstance;

  private agentWpVersion = '0.1-alpha1';
  private readonly userAgent;

  constructor(token, siteId) {
    this.token = token;
    this.siteId = siteId;
    this.userAgent = `agent-wp-client-${this.agentWpVersion}`;

    this.httpClient = axios.create({
      timeout: 15000,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json',
        'User-Agent': this.userAgent
      },
    });
  }

  request(method: string, url: string, params: object, data: object, additionalHeaders: object) {
    return this.httpClient.request({
      method,
      url,
      params,
      data,
      headers: additionalHeaders
    })
  }

  setToken(token) {
    this.token = token;
  }

  setSiteId(siteId) {
    this.siteId = siteId;
  }
}
