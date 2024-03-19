import { DefaultSvc } from "./index.mjs";
import { DropboxDb } from "../modules/index.mjs";
import * as dotenv from "dotenv";
import axios from "../libs/axios.mjs";
import mongoose from "mongoose";
import { isEmpty } from "ramda";
import moment from "moment";
dotenv.config();
class DropboxService extends DefaultSvc {
  constructor() {
    super();
    this.IS_DEFAULT = 1;
    this.IS_NOT_DEFAULT = 0;
  }
  async getAuthUrl() {
    try {
      let dropboxAcc = await DropboxDb.findOne({
        status: this.STATUS_WORKING,
      });
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

  async getRefreshToken(code) {
    try {
      let dropboxAcc = await DropboxDb.findOne({
        status: this.STATUS_WORKING,
      });
      if (isEmpty(dropboxAcc)) {
        throw {
          statusCode: 400,
          message: "Không tìm thấy tài khoản Dropbox hoạt động",
        };
      }
      const password = dropboxAcc.clientSecret;
      const username = dropboxAcc.clientId;
      const authBasic = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      const data = {
        code: code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.APP_FRONT_URL}`,
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.dropbox.com/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authBasic}`,
          Cookie: "locale=en; t=Hb24nNiwt78GMOxPNZjb1th8",
        },
        data: data,
      };
      const result = await axios.request(config);
      if (!result || !result?.data) {
        return {
          status: false,
          message: "Có lỗi khi xác thực tài khoản Dropbox",
        };
      }
      const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
      } = result.data;
      const currentTime = moment().unix();
      dropboxAcc.accessToken = accessToken;
      dropboxAcc.expiredTime = currentTime + expiresIn;
      dropboxAcc.refreshToken = refreshToken;
      const saveDropbox = await dropboxAcc.save();
      console.log(saveDropbox, 123123);
      if (!saveDropbox) {
        return {
          status: false,
          message: "Có lỗi khi lưu lại dữ liệu Dropbox",
        };
      }
      return {
        status: true,
        data: {
          accessToken: accessToken,
          expiredTime: currentTime + expiresIn,
          refreshToken: refreshToken,
        },
      };
    } catch (err) {
      if (err.response) {
        return {
          status: false,
          message: err.response.data.error,
        };
      }
    }
  }
  async getToken() {
    try {
      let dropboxAcc = await DropboxDb.findOne({
        status: this.STATUS_WORKING,
      });
      if (isEmpty(dropboxAcc)) {
        throw {
          statusCode: 400,
          message: "Không tìm thấy tài khoản Dropbox hoạt động",
        };
      }
      const { clientSecret, clientId, refreshToken, accessToken, expiredTime } =
        dropboxAcc;
      const currentTime = moment().unix();
      if (expiredTime <= currentTime) {
        let data = {
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
        };

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.dropbox.com/oauth2/token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: "locale=en; t=Hb24nNiwt78GMOxPNZjb1th8",
          },
          data: data,
        };
        const result = await axios.request(config);
        if (!result || !result?.data) {
          return {
            status: false,
            message: "Có lỗi khi lấy token Dropbox",
          };
        }
        const { access_token: newAccessToken, expires_in: newExpiresIn } =
          result.data;
        dropboxAcc.accessToken = newAccessToken;
        dropboxAcc.expiredTime = currentTime + newExpiresIn;
        const saveDropbox = await dropboxAcc.save();
        if (!saveDropbox) {
          return {
            status: false,
            message: "Có lỗi khi lưu lại dữ liệu Dropbox",
          };
        }
        return {
          status: true,
          data: {
            accessToken: accessToken,
            expiredTime: currentTime + newExpiresIn,
            refreshToken: refreshToken,
          },
        };
      } else {
        return {
          status: true,
          data: {
            accessToken: accessToken,
            expiredTime: currentTime + expiresIn,
            refreshToken: refreshToken,
          },
        };
      }
    } catch (err) {
      if (err.response) {
        return {
          status: false,
          message: err.response.data.error,
        };
      }
    }
  }
}
export default DropboxService;
