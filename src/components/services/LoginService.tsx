import axios from 'axios';

class LoginService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'auth_login/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;


  async getProfile(id: string, token: string): Promise<any> {
    debugger;
    const url = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "person_profile/view/" + id + "/";
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return false;
    }
  } 

  async onlineLogin(email:string, password: string): Promise<any> {
    debugger;
    const creds = {
        email: email, password: password
    }
    try {
      const response = await axios.post(this.apiUrl, creds, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing bulk data:', error);
      return false;
    }
  }
}

export default new LoginService();
