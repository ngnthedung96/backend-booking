import { DefaultSvc } from "./index.mjs";
class UserService extends DefaultSvc {
  constructor() {
    super();
    // status
    this.STATUS_ACCEPT = 3;
    this.STATUS_WAITING = 2;
    this.STATUS_REQUEST = 1;
  }
}
export default UserService;
