import { DefaultSvc, DropboxSvc } from "./index.mjs";
const dropboxService = new DropboxSvc();
class ImageDropboxService extends DefaultSvc {
  constructor() {
    super();
  }
  async getImgUrl(fileData) {
    try {
      const { data: dataImg, name: nameImg } = fileData;
      // lấy token
      const getToken = await dropboxService.getToken();
      if (!getToken.status || !getToken.data) {
        return {
          status: false,
          message: "Có lỗi khi xác thực Dropbox",
        };
      }
      const { accessToken: accessTokenDropbox } = getToken.data;
      // tải ảnh
      const uploadFile = await dropboxService.uploadFile(
        accessTokenDropbox,
        dataImg,
        nameImg
      );
      if (!uploadFile.status || !uploadFile.data) {
        return {
          status: false,
          message: "Có lỗi khi tải tài liệu",
        };
      }
      const { pathLower: pathLowerImg, id: idImg } = uploadFile.data;
      // lấy link preview
      const getPreviewUrl = await this.handlePreviewUrl(
        accessTokenDropbox,
        pathLowerImg
      );
      if (!getPreviewUrl.status || !getPreviewUrl.data) {
        return {
          status: false,
          message: "Có lỗi khi lấy đường dẫn tài liệu",
        };
      }
      const previewUrl = getPreviewUrl.data;
      return {
        status: true,
        data: {
          pathLowerImg,
          idImg,
          previewUrl: previewUrl,
        },
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }
  async handlePreviewUrl(accessTokenDropbox, pathLowerImg) {
    try {
      let previewUrl = "";
      const getPreviewUrlFile = await dropboxService.getPreviewUrlFile(
        accessTokenDropbox,
        pathLowerImg
      );
      if (!getPreviewUrlFile.status || !getPreviewUrlFile.data) {
        if (getPreviewUrlFile.message == "shared_link_already_exists") {
          const getSharedUrlFile = await dropboxService.getSharedPreviewUrlFile(
            accessTokenDropbox,
            pathLowerImg
          );
          if (!getSharedUrlFile.status || !getSharedUrlFile.data) {
            return {
              status: false,
              message: "Có lỗi khi lấy đường dẫn",
            };
          }
          previewUrl = getSharedUrlFile.data;
        } else {
          return {
            status: false,
            message: getPreviewUrlFile.message,
          };
        }
      } else {
        previewUrl = getPreviewUrlFile.data;
      }
      return {
        status: true,
        data: previewUrl,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }
}
export default ImageDropboxService;
