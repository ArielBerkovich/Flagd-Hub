export default class LoginRequest {
    username: string;
    password: string;
  
      /**
     * @param username 
     * @param password 
     */
      constructor({
          username,
          password
        }: {
          username: string;
          password: string;
        }) {
          this.username = username;
          this.password = password;
        }
  }
  