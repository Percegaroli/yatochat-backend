export interface GroupInvitationDTO {
  user: {
    name: string;
    lastName: string;
  };
  group: {
    name: string;
  };
  invitationDate: Date;
}
