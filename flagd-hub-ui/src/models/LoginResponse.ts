export default class LoginResponse {
  token: string;

    /**
   * @param token - The token
   */
    constructor({
        token,
      }: {
        token: string;
      }) {
        this.token = token;
      }
}
