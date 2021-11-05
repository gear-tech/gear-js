import { PaginationModel, UserPrograms } from 'types/common';
import { ProgramRPCModel, ProgramsPagintaionModel } from 'types/program';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_PROGRAMS_ALL = 'program.all';

  protected readonly API_PROGRAMS_USER = 'program.allUser';

  protected readonly API_REFRESH_PROGRAM = 'program.data';

  public fetchAllPrograms(params: PaginationModel): Promise<ProgramsPagintaionModel> {
    return this.apiRequest.getResource(this.API_PROGRAMS_ALL, { ...params });
  }

  public fetchUserPrograms(params: UserPrograms): Promise<ProgramsPagintaionModel> {
    return this.apiRequest.getResource(this.API_PROGRAMS_USER, { ...params });
  }

  public fetchProgram(hash: string): Promise<ProgramRPCModel> {
    return this.apiRequest.getResource(this.API_REFRESH_PROGRAM, { hash });
  }
}
