import { DefaultSvc } from "./index.mjs";
import { DropboxDb } from "../modules/index.mjs";
import * as dotenv from "dotenv";
import axios from "../libs/axios.mjs";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
dotenv.config();
class DropboxService extends DefaultSvc {
  constructor() {
    super();
    this.IS_DEFAULT = 1;
    this.IS_NOT_DEFAULT = 0;
  }
  async getAuthUrl() {
    try {
      let dropboxAcc = await DropboxDb.aggregate([
        {
          $match: {
            status: this.STATUS_WORKING,
          },
        },
      ]);
      if (isEmpty(dropboxAcc)) {
        throw {
          statusCode: 400,
          message: "Không tìm thấy tài khoản Dropbox hoạt động",
        };
      }
      dropboxAcc = dropboxAcc ? dropboxAcc[0] : null;
      return {
        status: true,
        data: `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAcc.clientId}&token_access_type=offline&response_type=code&redirect_uri=${process.env.APP_FRONT_URL}`,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async getRefreshToken() {}
}
export default DropboxService;
