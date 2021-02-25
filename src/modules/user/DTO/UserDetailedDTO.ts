import { ChatroomDetailsDTO } from '../../chatroom/DTO/ChatroomDetailsDTO';

export interface UserDetailedDTO {
  id: string;
  name: string;
  lastName: string;
  chatrooms: Array<ChatroomDetailsDTO>;
  email: string;
}
