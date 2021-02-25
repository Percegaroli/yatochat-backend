import { UserResumeDTO } from 'src/modules/user/DTO/UserResumeDTO';
import { Roles } from '../enum/Roles';

export interface GroupMemberDTO {
  user: UserResumeDTO;
  role: Roles;
  joinedAt: Date;
}
