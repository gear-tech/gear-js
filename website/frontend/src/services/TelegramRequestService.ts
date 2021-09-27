import ServerRPCRequestService from './ServerRPCRequestService';

export default class GitRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_TELEGRAM_LOGIN_PATH = 'login.telegram';

  public authWithTelegram(authParams: {}): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_TELEGRAM_LOGIN_PATH, { ...authParams });
  }
}
