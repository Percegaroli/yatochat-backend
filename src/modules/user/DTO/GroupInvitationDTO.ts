export interface GroupInvitationDTO {
  user: {
    id: string;
    name: string;
    lastName: string;
  };
  group: {
    id: string;
    name: string;
  };
  invitationDate: Date;
}
