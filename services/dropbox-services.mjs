import { DefaultSvc } from "./index.mjs";
import * as dotenv from "dotenv";
import axios from "../libs/axios.mjs";
dotenv.config();
class DropboxService extends DefaultSvc {
  constructor() {
    super();
    this.IS_DEFAULT = 1;
    this.IS_NOT_DEFAULT = 0;
  }
  getAuthUrl(dropboxId) {
    return `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.DIGEST}&token_access_type=offline&response_type=code&redirect_uri=http://localhost:8080`;
  }
}
export default DropboxService;
