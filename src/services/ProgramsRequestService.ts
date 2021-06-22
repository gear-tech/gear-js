import { GEAR_STORAGE_KEY } from 'consts';
import ServerRequestService from './ServerRequestService';

export default class ProgramRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_PROGRAMS_ALL = '/programs/all';
  
  protected readonly API_REFRESH_PROGRAM = '/programs/data';
  
  public fetchAllPrograms(): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_PROGRAMS_ALL, undefined, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public fetchProgram(hash: string): Promise<{ token: any }> {
    return this.apiRequest.getResource(this.API_REFRESH_PROGRAM, {hash}, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
}