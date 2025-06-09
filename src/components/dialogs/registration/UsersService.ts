import { IUser, IUserAccess } from '@/components/interfaces/iuser';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';


class UsersService {
  private userApi = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'auth_users/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;

  async syncUserData(userData: IUser,userAccess: IUserAccess[]): Promise<any> {
    const payload = {
      user: userData,
      user_access: userAccess
    }
    console.log("User payload!", Array(payload));
    try {
      debugger;
      const response = await axios.post(this.userApi, Array(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("User successfully synchronized!", response.data);
      return true;
    } catch (error) {
      console.error('Error syncing user data:', error);
      return false;
    }
  }
}

export default new UsersService();
