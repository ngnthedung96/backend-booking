import { isEmpty } from "ramda";
import { DefaultSvc } from "./index.mjs";
import moment from "moment";
import { da } from "@faker-js/faker";
import mongoose from "mongoose";
class ScheduleService extends DefaultSvc {
  constructor() {
    super();
    this.REPEATE_ALL_DAY = 1;
    this.REPEATE_DAYS_IN_WEEK = 2;
    this.REPEATE_DAYS_AT_WEEKEND = 3;
    this.REPEATE_SOME_DAYS = 4;
  }
  // validate
  validateScheduleData(arraySchedule, month) {
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
      if (
        !Number(maxNumber) ||
        !Number(timeStart) ||
        !Number(timeEnd) ||
        !typeRepeat
      ) {
        return {
          status: false,
          message: "Vui lòng nhập đầy đủ dữ liệu lịch khám",
        };
      }
      // validate hour
      if (
        timeStart >= timeEnd ||
        (timeStart < 0 && timeStart > 86400) ||
        (timeEnd < 0 && timeEnd > 86400)
      ) {
        return {
          status: false,
          message: "Giờ bắt đầu hoặc giờ kết thúc không hợp lệ",
        };
      }
      // validate type
      const checkTypeRepeat = this.checkTypeRepeat(typeRepeat, someDays, month);
      if (!checkTypeRepeat.status) {
        return {
          status: false,
          message: checkTypeRepeat.message,
        };
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
    }
    return {
      status: true,
    };
  }
  checkInSamePeriodTime(currentSchedule, allSchedule) {
    // clone 2 array
    const currentScheduleDuplicate = JSON.parse(
      JSON.stringify(currentSchedule)
    );
    const allScheduleDuplicate = JSON.parse(JSON.stringify(allSchedule));
    const { timeStart, timeEnd, typeRepeat, someDays } =
      currentScheduleDuplicate;
    let checkSame = false;
    // Lặp để check trùng nhau
    for (let i = 0; i < allScheduleDuplicate.length; i++) {
      const {
        timeStart: targetTimeStart,
        timeEnd: targetTimeEnd,
        typeRepeat: targetTypeRepeat,
        someDays: targetSomeDays,
      } = allScheduleDuplicate[i];
      // loại currentSchedule
      if (
        JSON.stringify(allScheduleDuplicate[i]) ===
        JSON.stringify(currentScheduleDuplicate)
      ) {
        allScheduleDuplicate.splice(i, 1);
        i--;
        continue;
      }
      // so sánh các trường hợp trùng
      let shouldCompare = false;
      if (typeRepeat == this.REPEATE_ALL_DAY) {
        shouldCompare = true;
      } else if (typeRepeat == this.REPEATE_DAYS_AT_WEEKEND) {
        if (targetTypeRepeat != this.REPEATE_DAYS_IN_WEEK) {
          if (targetTypeRepeat == this.REPEATE_SOME_DAYS) {
            const findDayAtWeekend = targetSomeDays.find((day) => {
              const reverseDay = moment(day, "DD/MM/YYYY").format("YYYY/MM/DD");
              return (
                moment(reverseDay).day() == 0 || moment(reverseDay).day() == 6
              );
            });
            if (findDayAtWeekend) {
              shouldCompare = true;
            }
          } else {
            shouldCompare = true;
          }
        }
      } else if (typeRepeat == this.REPEATE_DAYS_IN_WEEK) {
        if (targetTypeRepeat != this.REPEATE_DAYS_AT_WEEKEND) {
          if (targetTypeRepeat == this.REPEATE_SOME_DAYS) {
            const findDayInWeek = targetSomeDays.find((day) => {
              const reverseDay = moment(day, "DD/MM/YYYY").format("YYYY/MM/DD");
              return (
                moment(reverseDay).day() != 0 && moment(reverseDay).day() != 6
              );
            });
            if (findDayInWeek) {
              shouldCompare = true;
            }
          } else {
            shouldCompare = true;
          }
        }
      } else if (typeRepeat == this.REPEATE_SOME_DAYS) {
        if (targetTypeRepeat == this.REPEATE_ALL_DAY) {
          shouldCompare = true;
        } else if (targetTypeRepeat == this.REPEATE_DAYS_AT_WEEKEND) {
          const findDayAtWeekend = someDays.find((day) => {
            const reverseDay = moment(day, "DD/MM/YYYY").format("YYYY/MM/DD");
            return (
              moment(reverseDay).day() == 0 || moment(reverseDay).day() == 6
            );
          });
          if (findDayAtWeekend) {
            shouldCompare = true;
          }
        } else if (targetTypeRepeat == this.REPEATE_DAYS_IN_WEEK) {
          const findDayInWeek = someDays.find((day) => {
            const reverseDay = moment(day, "DD/MM/YYYY").format("YYYY/MM/DD");
            return (
              moment(reverseDay).day() != 0 && moment(reverseDay).day() != 6
            );
          });
          if (findDayInWeek) {
            shouldCompare = true;
          }
        } else if (targetTypeRepeat == this.REPEATE_SOME_DAYS) {
          for (let day of someDays) {
            if (targetSomeDays.includes(day)) {
              shouldCompare = true;
              break;
            }
          }
        }
      }
      if (shouldCompare) {
        if (
          (targetTimeStart < timeStart && timeStart < targetTimeEnd) ||
          (targetTimeStart < timeEnd && timeEnd < targetTimeEnd) ||
          (timeStart < targetTimeStart && timeEnd > targetTimeEnd) ||
          (timeStart == targetTimeStart && timeEnd == targetTimeEnd)
        ) {
          checkSame = true;
          break;
        }
      }
    }

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
  checkTypeRepeat(typeRepeat, someDays, month) {
    if (
      typeRepeat == this.REPEATE_ALL_DAY ||
      typeRepeat == this.REPEATE_DAYS_AT_WEEKEND ||
      typeRepeat == this.REPEATE_DAYS_IN_WEEK ||
      typeRepeat == this.REPEATE_SOME_DAYS
    ) {
      if (typeRepeat == this.REPEATE_SOME_DAYS) {
        if (!someDays || !Array.isArray(someDays) || isEmpty(someDays)) {
          return {
            status: false,
            message: "Vui lòng chọn một số ngày nhất định",
          };
        }
        const currentYear = moment().year();
        const checkDay = someDays.find((day) => {
          const reverseDay = moment(day, "DD/MM/YYYY").format("YYYY/MM/DD");
          return (
            !moment(day, "DD/MM/YYYY", true).isValid() ||
            !moment(reverseDay).isSame(`${currentYear}/0${month}/01`, "month")
          );
        });
        if (checkDay) {
          return {
            status: false,
            message: "Ngày được chọn không hợp lệ",
          };
        }
      }
    } else {
      return {
        status: false,
        message: "Kiểu lặp lại không hợp lệ",
      };
    }
    return {
      status: true,
    };
  }
  // -------------------------create------------------
  // get days
  getDaysArray(year, month, typeRepeat) {
    const monthIndex = month - 1; // 0..11 instead of 1..12
    let names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const date = new Date(year, monthIndex, 1);
    const result = [];
    while (date.getMonth() == monthIndex) {
      if (typeRepeat == this.REPEATE_ALL_DAY) {
        result.push(`${date.getDate()}`);
      } else if (typeRepeat == this.REPEATE_DAYS_AT_WEEKEND) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          result.push(`${date.getDate()}`);
        }
      } else if (typeRepeat == this.REPEATE_DAYS_IN_WEEK) {
        if (date.getDay() != 0 && date.getDay() != 6) {
          result.push(`${date.getDate()}`);
        }
      }
      date.setDate(date.getDate() + 1);
    }
    return result;
  }
  formatDaySchedule(scheduleData, doctorId, currentYear, month) {
    let arrData = [];
    for (let schedule of scheduleData) {
      const { maxNumber, timeStart, timeEnd, typeRepeat, someDays } = schedule;
      const currentTime = moment().unix();
      const formattedDoctorId = mongoose.Types.ObjectId(doctorId);
      if (
        typeRepeat == this.REPEATE_ALL_DAY ||
        typeRepeat == this.REPEATE_DAYS_AT_WEEKEND ||
        typeRepeat == this.REPEATE_DAYS_IN_WEEK
      ) {
        let arrDay = [];
        if (typeRepeat == this.REPEATE_ALL_DAY) {
          arrDay = this.getDaysArray(currentYear, month, this.REPEATE_ALL_DAY);
        } else if (typeRepeat == this.REPEATE_DAYS_AT_WEEKEND) {
          arrDay = this.getDaysArray(
            currentYear,
            month,
            this.REPEATE_DAYS_AT_WEEKEND
          );
        } else if (typeRepeat == this.REPEATE_DAYS_IN_WEEK) {
          arrDay = this.getDaysArray(
            currentYear,
            month,
            this.REPEATE_DAYS_IN_WEEK
          );
        }
        for (let day of arrDay) {
          const timeStartText = moment.unix(timeStart).format("HH:mm");
          const timeEndText = moment.unix(timeEnd).format("HH:mm");
          const fullDay = `${timeStartText} ${day}/${month}/${currentYear}`;
          const fullEndDay = `${timeEndText} ${day}/${month}/${currentYear}`;
          const fullDayUnix = moment(fullDay, "HH:mm D/MM/YYYY").unix();
          const fullEndDayUnix = moment(fullEndDay, "HH:mm D/MM/YYYY").unix();
          arrData.push({
            maxNumber,
            doctorId: formattedDoctorId,
            timeStart: fullDayUnix,
            timeEnd: fullEndDayUnix,
            timeCreate: currentTime,
            updatedTime: currentTime,
            status: this.STATUS_WORKING,
          });
        }
      } else if (typeRepeat == this.REPEATE_SOME_DAYS) {
        for (let day of someDays) {
          const timeStartText = moment.unix(timeStart).format("HH:mm");
          const timeEndText = moment.unix(timeEnd).format("HH:mm");
          const fullDay = `${timeStartText} ${day}`;
          const fullEndDay = `${timeEndText} ${day}`;
          const fullDayUnix = moment(fullDay, "HH:mm DD/MM/YYYY");
          const fullEndDayUnix = moment(fullEndDay, "HH:mm DD/MM/YYYY");
          arrData.push({
            maxNumber,
            doctorId: formattedDoctorId,
            timeStart: fullDayUnix,
            timeEnd: fullEndDayUnix,
            timeCreate: currentTime,
            updatedTime: currentTime,
            status: this.STATUS_WORKING,
          });
        }
      }
    }
    if (!isEmpty(arrData)) {
      return {
        status: true,
        data: arrData,
      };
    } else {
      return {
        status: false,
        message: "Có lỗi khi tạo lịch",
      };
    }
  }
}
export default ScheduleService;
