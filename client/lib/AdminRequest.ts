import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class AdminRequest {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${window.location.origin}/wp-admin/admin-ajax.php`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add nonce to the request data
        config.data = {
          ...config.data,
          nonce: window.wpData.nonce,
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