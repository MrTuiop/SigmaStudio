export interface ProfileModel {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  iconPath: string | null;
}
