import { GEAR_STORAGE_KEY } from 'consts';
import { UserKeypairRPCModel, UserProfileRPCModel } from 'types/user';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class UserRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_FETCH_USER_TOKEN = 'login.dev';

  protected readonly API_FETCH_USER_DATA = 'user.profile';

  protected readonly API_GENERATE_KEYPAIR = 'user.generateKeypair';

  public authWithTest(userId: string): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_FETCH_USER_TOKEN, { id: userId });
  }

  public fetchUserData(): Promise<UserProfileRPCModel> {
    return this.apiRequest.getResource(this.API_FETCH_USER_DATA, undefined, {
      Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`,
    });
  }

  public generateKeypair(): Promise<UserKeypairRPCModel> {
    return this.apiRequest.getResource(this.API_GENERATE_KEYPAIR, undefined, {
      Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`,
    });
  }
}
