import { isEmpty } from "ramda";
import { DefaultSvc } from "./index.mjs";
class ScheduleService extends DefaultSvc {
  constructor() {
    super();
    this.REPEATE_ALL_DAY = 1;
    this.REPEATE_DAYS_IN_WEEK = 2;
    this.REPEATE_DAYS_AT_WEEKEND = 3;
    this.REPEATE_SOME_DAYS = 4;
  }
  validateScheduleData(arraySchedule) {
    if (isEmpty(arraySchedule)) {
      return {
        status: false,
        message: "Dữ liệu lịch khám không hợp lệ",
      };
    }
    for (let scheduleData of arraySchedule) {
      // validate element in array
      const { maxNumber, timeStart, timeEnd, typeRepeat, someDays } =
        scheduleData;
      if (!maxNumber || !timeStart || !timeEnd || !typeRepeat) {
        return {
          status: false,
          message: "Vui lòng nhập đầy đủ dữ liệu lịch khám",
        };
      }
      // validate hour
      const validateHourStart = this.validateHhMm(timeStart);
      const validateHourEnd = this.validateHhMm(timeEnd);
      if (!validateHourStart || !validateHourEnd) {
        return {
          status: false,
          message: "Giờ bắt đầu hoặc giờ kết thúc không hợp lệ",
        };
      }
      // validate type
      if (typeRepeat == this.REPEATE_SOME_DAYS) {
        if (!someDays || !Array.isArray(someDays) || isEmpty(someDays)) {
          return {
            status: false,
            message: "Vui lòng chọn một số ngày nhất định",
          };
        }
        const checkDay = someDays.find(
          (day) => !moment(day, "DD/MM/YYYY", true).isValid()
        );
        if (checkDay) {
          return {
            status: false,
            message: "Ngày được chọn không hợp lệ",
          };
        }
      }
      // check trùng lịch
      const checkInSamePeriodTime = this.checkInSamePeriodTime(
        scheduleData,
        arraySchedule
      );
      if (!checkInSamePeriodTime.status) {
        return {
          status: false,
          message: checkInSamePeriodTime.message,
        };
      }
      return {
        status: true,
      };
    }
  }
  checkInSamePeriodTime(currentSchedule, allSchedule) {
    const { timeStart, timeEnd } = currentSchedule;
    let checkSame = allSchedule.find(
      ({ timeStart: targetTimeStart, timeEnd: targetTimeEnd }) =>
        (targetTimeStart < timeStart && timeStart < targetTimeEnd) ||
        (targetTimeStart < timeEnd && timeEnd < targetTimeEnd) ||
        (timeStart < targetTimeStart && timeEnd > targetTimeEnd)
    );
    if (checkSame) {
      return {
        status: false,
        message: "Lịch mới tạo đã trùng lịch cũ",
      };
    } else {
      return {
        status: true,
      };
    }
  }
}
export default ScheduleService;
