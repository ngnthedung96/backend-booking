import { DefaultSvc } from "./index.mjs";
class UserService extends DefaultSvc {
  constructor() {
    super();
    // role
    this.ROLE_ADMIN = 1;
    this.ROLE_DOCTOR = 2;
    this.ROLE_PATIENT = 3;

    // gender
    this.UNKNOWN_GENDER = 0;
    this.GENDER_MALE = 1;
    this.GENDER_FEMALE = 2;
  }
}
export default UserService;
