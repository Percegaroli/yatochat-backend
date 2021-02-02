import { UserResumeDTO } from '../../user/DTO/UserResumeDTO';
import { Message } from '../interfaces/Message';

export interface ChatroomDetailsDTO {
  name: string;
  photo?: string;
  members: Array<UserResumeDTO>;
  createdAt: Date;
  messages?: Array<Message>;
}
