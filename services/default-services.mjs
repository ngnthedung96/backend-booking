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
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  validateHhMm(inputField) {
    const day = moment(inputField, "HH:mm", true).isValid();
    return day;
  }
}
export default DefaultService;
