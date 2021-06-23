import ServerRequestService from './ServerRequestService';

export default class GitRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_TELEGRAM_LOGIN_PATH = '/auth/login/telegram';

  public authWithTelegram(authParams: {}): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_TELEGRAM_LOGIN_PATH, undefined, "POST",  {...authParams})
  }
}