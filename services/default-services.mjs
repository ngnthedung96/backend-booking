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
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
      inputField.value
    );
    if (isValid) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }

    return isValid;
  }
}
export default DefaultService;
