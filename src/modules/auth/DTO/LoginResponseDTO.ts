import { UserDetailedDTO } from 'src/modules/user/DTO/UserDetailedDTO';

export interface LoginResponseDTO {
  user: UserDetailedDTO;
  token: string;
}
