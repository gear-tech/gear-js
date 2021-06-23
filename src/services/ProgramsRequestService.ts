import { GEAR_STORAGE_KEY } from 'consts';
import { ProgramModel } from 'types/program';
import ServerRequestService from './ServerRequestService';

export default class ProgramRequestService {
  apiRequest = new ServerRequestService();

  protected readonly API_PROGRAMS_ALL = '/programs/all';
  
  protected readonly API_REFRESH_PROGRAM = '/programs/data';
  
  public fetchAllPrograms(): Promise<{ programs: ProgramModel[] }> {
    return this.apiRequest.getResource(this.API_PROGRAMS_ALL, undefined, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public fetchProgram(hash: string): Promise<{ program: ProgramModel }> {
    return this.apiRequest.getResource(this.API_REFRESH_PROGRAM, {hash}, undefined, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
}