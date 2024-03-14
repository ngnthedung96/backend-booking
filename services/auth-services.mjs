import { DefaultSvc } from "./index.mjs";

class AuthService extends DefaultSvc {
  constructor() {
    super();
  }
  getHTMLVerifyEmail(redirectLink) {
    let html = `
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px">
              <a
                href="https://www.blogdesire.com"
                target="_blank"
                style="display: inline-block"
              >
                <img
                  src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png"
                  alt="Logo"
                  border="0"
                  width="48"
                  style="
                    display: block;
                    width: 48px;
                    max-width: 48px;
                    min-width: 48px;
                  "
                />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 36px 24px 0;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                border-top: 3px solid #d4dadf;
              "
            >
              <h1
                style="
                  margin: 0;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: -1px;
                  line-height: 48px;
                "
              >
                Xác thực tài khoản của bạn
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
              "
            >
              <p style="margin: 0">
                Chào bạn, bạn đã đăng ký tài khoản thành công. Hãy nhấn vào nút bên dưới để xác thực tài khoản của bạn
              </p>
            </td>
          </tr>
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          align="center"
                          bgcolor="#1a82e2"
                          style="border-radius: 6px"
                        >
                          <a
                            href="${redirectLink}"
                            target="_blank"
                            style="
                              display: inline-block;
                              padding: 16px 36px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 6px;
                            "
                            >Xác thực email</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
                border-bottom: 3px solid #d4dadf;
              "
            >
              <p style="margin: 0">
                Cảm ơn bạn đã đăng kí tài khoản!!!!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
    return html;
  }
  getHTMLResetPass(code, redirectLink) {
    let html = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px">
              <a
                href="https://www.blogdesire.com"
                target="_blank"
                style="display: inline-block"
              >
                <img
                  src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png"
                  alt="Logo"
                  border="0"
                  width="48"
                  style="
                    display: block;
                    width: 48px;
                    max-width: 48px;
                    min-width: 48px;
                  "
                />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 36px 24px 0;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                border-top: 3px solid #d4dadf;
              "
            >
              <h1
                style="
                  margin: 0;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: -1px;
                  line-height: 48px;
                "
              >
                Cài đặt lại mật khẩu
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
              "
            >
              <p style="margin: 0">
                Nếu bạn đã mất mật khẩu hoặc quên mật khẩu và muốn cài đặt lại, hãy sử dụng mã và bấm vào nút bên dưới để bắt đầu
              </p>
            </td>
          </tr>
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          align="center"
                          style="border-radius: 6px; font-size: 299%;"
                        >
                        <span style="display:block">${code}</span>
                          <a
                            href="${redirectLink}"
                            target="_blank"
                            style="
                              background-color: #1a82e2;
                              display: inline-block;
                              padding: 16px 36px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 6px;
                            "
                            >Cài đặt lại mật khẩu</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
              "
            >
              <p style="margin: 0">
                Nếu bạn không có yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Chỉ có người có quyền truy cập vào email của bạn mới có thể cài đặt lại mật khẩu
              </p>
            </td>
          </tr>
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
                border-bottom: 3px solid #d4dadf;
              "
            >
              <p style="margin: 0">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!!!!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
    return html;
  }
}
export default AuthService;
