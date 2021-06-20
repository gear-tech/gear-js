import ServerRequestService from './ServerRequestService';

export default class GitRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_GIT_LOGIN_PATH = '/auth/login/github';

  protected readonly API_TELEGRAM_LOGIN_PATH = '/auth/login/telegram';

  public authWithGit(authCode: string): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_GIT_LOGIN_PATH, {code: authCode});
  }

  public authWithTelegram(authParams: object): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_TELEGRAM_LOGIN_PATH, {params: authParams})
  }

}