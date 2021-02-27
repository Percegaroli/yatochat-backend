import { ChatroomDetailsDTO } from '../../chatroom/DTO/ChatroomDetailsDTO';
import GroupInvitation from '../interface/Invitation';

export interface UserDetailedDTO {
  id: string;
  name: string;
  lastName: string;
  chatrooms: Array<ChatroomDetailsDTO>;
  email: string;
  groupInvitations: Array<GroupInvitation>;
}
