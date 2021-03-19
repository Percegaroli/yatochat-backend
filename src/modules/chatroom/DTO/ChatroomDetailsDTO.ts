import { GroupMemberDTO } from '../DTO/GroupMemberDTO';
import { Message } from '../interfaces/Message';

export interface ChatroomDetailsDTO {
  id: string;
  name: string;
  photoUrl?: string;
  members: Array<GroupMemberDTO>;
  createdAt: Date;
  messages: Array<Message>;
}
