export interface CreateUserDTO {
  id: string;
  version: number;
  email: string;
  username: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}
