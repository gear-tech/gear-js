import { GEAR_STORAGE_KEY } from 'consts';
import { UserKeypairModel, UserModel } from 'types/user';
import ServerRequestService from './ServerRequestService';

export default class UserRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_FETCH_USER_TOKEN = '/auth/login/test';

  protected readonly API_FETCH_USER_DATA = '/users/profile';

  protected readonly API_BALANCE_TRANSFER = '/gear/balance-transfer';

  protected readonly API_GENERATE_KEYPAIR = '/gear/generate-keypair';

  public authWithTest(userId: string): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_FETCH_USER_TOKEN, {id: userId})
  }

  public fetchUserData(): Promise<UserModel> {
    return this.apiRequest.getResource(this.API_FETCH_USER_DATA, undefined, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
  
  public balanceTransfer(balanceValue: number): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_BALANCE_TRANSFER, undefined, 'POST', {value: balanceValue}, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public generateKeypair(): Promise<UserKeypairModel> {
    return this.apiRequest.getResource(this.API_GENERATE_KEYPAIR, undefined, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
}