import ServerRequestService from './ServerRequestService';

export default class GitRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_GIT_LOGIN_PATH = '/login/github';

  public authWithGit(authCode: string): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_GIT_LOGIN_PATH, {code: authCode});
  }

}