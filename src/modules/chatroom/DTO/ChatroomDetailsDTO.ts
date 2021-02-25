import { UserResumeDTO } from '../../user/DTO/UserResumeDTO';
import { GroupMemberDTO } from '../DTO/GroupMemberDTO';
import { Message } from '../interfaces/Message';

export interface ChatroomDetailsDTO {
  id: string;
  name: string;
  photo?: string;
  members: Array<GroupMemberDTO>;
  createdAt: Date;
  messages: Array<Message>;
}
