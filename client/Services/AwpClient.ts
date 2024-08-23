import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { usePage } from '@/Providers/PageProvider';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { useNotifications } from '@/Providers/NotificationProvider';
import { FeedbackType } from '@/Providers/FeedbackProvider';

export default class AwpClient {
  public token?: string;
  public agentWpVersion = '0.1-alpha1';

  private httpClient: AxiosInstance;
  private baseUrl: string = 'https://app.agentwp.com';
  private adminRequest = useAdminRoute();

  constructor( token?: string ) {
    const { page, setPageData } = usePage();
    const { notify } = useNotifications();
    this.token = token || page.access_token;
    this.baseUrl = page.api_host;

    this.httpClient = axios.create( {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ this.token }`,
        'X-Wp-Agent-Version': this.agentWpVersion,
        'X-Wp-User-Id': page.user.ID,
        'X-Wp-Site-Id': page.site_id,
      },
    } );

    this.httpClient.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if ( error.response && error.response.status === 401 ) {
          // if there is a refresh token then refresh the token
          if ( page.refresh_token ) {
            const newToken = this.refreshToken();
            setPageData( { ...page, access_token: newToken } );
          }

          // Logout user or redirect to login page
          notify( 'Your API token is invalid or expired. Please login again.', 'error' );
          this.adminRequest.get( 'logout' );
          throw new Error( 'Your API token is invalid or expired. Please login again.' );
        }
        return Promise.reject( error );
      },
    );
  }

  isAuthorized() {
    if ( ! this.token ) {
      return null;
    }
    return this;
  }

  getStreamUrl( userRequestId: string ) {
    return `${ this.baseUrl }/api/request/${ userRequestId }/stream`;
  }

  async getConversation( since?: string ): Promise< AxiosResponse > {
    return this.request( 'GET', `${ this.baseUrl }/api/convo`, {
      since,
    } );
  }

  async getSuggestions( pageCtx?: any ): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/convo/suggestions`, {
      context: pageCtx,
    } );
  }

  async clearConversation(): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/convo/clear` );
  }

  async unclearConversation( since: string ): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/convo/unclear`, {}, { since } );
  }

  async getHistory( since?: string ): Promise< AxiosResponse > {
    return this.request( 'GET', `${ this.baseUrl }/api/convo/history`, {
      since,
    } );
  }

  async storeAgentResult( actionId: string, data: object ): Promise< AxiosResponse > {
    return this.request(
      'POST',
      `${ this.baseUrl }/api/action/${ actionId }/result`,
      {},
      { result: data },
    );
  }
  async abortUserRequest( userRequestId: string ): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/request/${ userRequestId }/abort`, {}, {} );
  }

  async getSettings(): Promise< AxiosResponse > {
    return this.request( 'GET', `${ this.baseUrl }/api/site/settings` );
  }

  async updateSetting( name: string, value: any ): Promise< AxiosResponse > {
    return this.request( 'PUT', `${ this.baseUrl }/api/site/settings`, {}, { name, value } );
  }

  async storeConversation( data: object ): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/convo`, {}, data );
  }

  async refreshToken(): Promise< AxiosResponse > {
    return this.adminRequest( `refresh_token` );
  }

  async postEscalation( escalationId: string ): Promise< AxiosResponse > {
    return this.request( 'POST', `${ this.baseUrl }/api/escalation/${ escalationId }` );
  }

  async removeUserRequest( userRequestId: string ): Promise< AxiosResponse > {
    return this.request( 'DELETE', `${ this.baseUrl }/api/request/${ userRequestId }` );
  }

  async feedback( userRequestId: string, data: FeedbackType ): Promise< AxiosResponse > {
    return this.request(
      'POST',
      `${ this.baseUrl }/api/request/${ userRequestId }/feedback`,
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
  ): Promise< AxiosResponse > {
    if ( ! this.token ) {
      return Promise.reject( new Error( 'Token is undefined or empty' ) );
    }

    return this.httpClient.request( {
      method,
      url,
      params,
      data,
      headers: additionalHeaders,
    } );
  }

  setBaseUrl( baseUrl: string ) {
    this.baseUrl = baseUrl;
    return this;
  }

  setToken( token: string ) {
    this.token = token;
  }
}
