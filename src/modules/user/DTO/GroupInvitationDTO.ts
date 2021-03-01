export interface GroupInvitationDTO {
  user: {
    name: string;
    lastName: string;
  };
  group: {
    id: string;
    name: string;
  };
  invitationDate: Date;
}
