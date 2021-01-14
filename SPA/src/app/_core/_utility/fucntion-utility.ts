import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', })
export class FunctionUtility {
  constructor() { }

  /**
   * Convert today to string format
   * @returns yyyy/MM/dd
   */
  getToDay() {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  /**
   * Convert input date to string format
   * @param date
   * @returns yyyy/MM/dd
   */
  getDateFormat(date: Date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  /**
   * Convert input date to short date string format
   * @param date
   * @returns yyyyMM
   */
  getFullYearAndMonthToString(date: Date) {
    return `${date.getFullYear()}${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}`;
  }

  /**
   * Convert to short month string format
   * @param month
   * @returns MMM.
   */
  getMonthInCharacter(month: string) {
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    return months[Number(month) - 1];
  }

  /**
   * Check if folder name contains special characters
   * @param folderName
   * @returns true | false
   */
  checkCreatFolder(folderName: string) {
    const charCheck = /[\\/,:*?"|<>]+/;
    if (charCheck.test(folderName)) {
      return true;
    }
  }

  /**
   * Return the first date of current month
   * @returns Date
   */
  getFirstDateOfCurrentMonth() {
    const today = new Date();
    return new Date(today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + '01');
  }

  /**
   * Convert input date to date without time
   * @param date
   * @returns Date
   */
  returnDayNotTime(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  }
}
