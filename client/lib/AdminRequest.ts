import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Page } from '@/lib/bootstrap';
export default class AdminRequest {
  private axiosInstance: AxiosInstance;

  constructor(page: Page) {
    this.axiosInstance = axios.create({
      baseURL: page.ajax_url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add nonce to the request data
        config.data = {
          ...config.data,
          nonce: page.nonce,
        };

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  public async get<T = any, R = AxiosResponse<T>>(
    action: string,
    params?: any,
  ): Promise<R> {
    return this.axiosInstance.get<T, R>('', {
      params: {
        action,
        ...params,
      },
    });
  }

  public async post<T = any, R = AxiosResponse<T>>(
    action: string,
    data?: any,
  ): Promise<R> {
    return this.axiosInstance.post<T, R>('', data, {
      params: {
        action,
      },
    });
  }
}
