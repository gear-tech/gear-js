import { GEAR_STORAGE_KEY } from 'consts';
import { ProgramsInterface, ProgramInterface } from 'types/program';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_PROGRAMS_ALL = 'program.all';
  
  protected readonly API_REFRESH_PROGRAM = 'program.data';
  
  public fetchAllPrograms(): Promise<ProgramsInterface> {
    return this.apiRequest.getResource(this.API_PROGRAMS_ALL, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public fetchProgram(hash: string): Promise<ProgramInterface> {
    return this.apiRequest.getResource(this.API_REFRESH_PROGRAM, {hash}, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
}