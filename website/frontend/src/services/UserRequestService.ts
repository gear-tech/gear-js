import { UserKeypairRPCModel, UserProfileRPCModel } from 'types/user';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class UserRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_FETCH_USER_TOKEN = 'login.dev';

  protected readonly API_FETCH_USER_DATA = 'user.profile';

  protected readonly API_GENERATE_KEYPAIR = 'user.generateKeypair';

  public fetchUserData(): Promise<UserProfileRPCModel> {
    return this.apiRequest.getResource(this.API_FETCH_USER_DATA, undefined, {});
  }

  public generateKeypair(): Promise<UserKeypairRPCModel> {
    return this.apiRequest.getResource(this.API_GENERATE_KEYPAIR, undefined, {});
  }
}
