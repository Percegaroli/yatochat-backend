import { ChatroomDetailsDTO } from '../../chatroom/DTO/ChatroomDetailsDTO';
import { GroupInvitationDTO } from './GroupInvitationDTO';

export interface UserDetailedDTO {
  id: string;
  name: string;
  lastName: string;
  chatrooms: Array<ChatroomDetailsDTO>;
  email: string;
  groupInvitations: Array<GroupInvitationDTO>;
}
