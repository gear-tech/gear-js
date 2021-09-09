import { Program } from 'src/programs/entities/program.entity';
import { User } from 'src/users/entities/user.entity';

export interface LogMessage {
  id: string;
  responseId?: string;
  destination: User;
  program: Program;
  payload?: string;
  response?: string;
  isRead?: boolean;
  date: Date;
}
