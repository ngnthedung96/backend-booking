class DefaultService {
  constructor() {
    this.STATUS_WORKING = 1;
    this.STATUS_DISABLED = 0;
  }
  convertStatus(status) {
    let statusText = "";
    if (this.STATUS_WORKING) {
      statusText = "Đang hoạt động";
    } else {
      statusText = "Ngừng hoạt động";
    }
    return statusText;
  }
}
export default DefaultService;
