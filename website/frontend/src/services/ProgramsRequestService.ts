import { PaginationModel, UserPrograms } from 'types/common';
import { ProgramModel, ProgramPaginationModel } from 'types/program';
import ServerRPCRequestService from './ServerRPCRequestService';

class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_PROGRAMS_ALL = 'program.all';

  protected readonly API_PROGRAMS_USER = 'program.allUser';

  protected readonly API_REFRESH_PROGRAM = 'program.data';

  public fetchAllPrograms = (params: PaginationModel) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.API_PROGRAMS_ALL, { ...params });
  };

  public fetchUserPrograms = (params: UserPrograms) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.API_PROGRAMS_USER, { ...params });
  };

  public fetchProgram = (id: string) => {
    return this.apiRequest.callRPC<ProgramModel>(this.API_REFRESH_PROGRAM, { id });
  };
}

export const programService = new ProgramRequestService();
