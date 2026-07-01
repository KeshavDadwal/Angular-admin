import { formatDate } from '@angular/common';

export class AllHoliday {
  id: string;
  holidayName: string;
  shift: string;
  details: string;
  date: string;
  location: string;
  holidayType: string;
  createdBy: string;
  creationDate: string;
  approvalStatus: string;

  constructor(holiday: Partial<AllHoliday>) {
    this.id = holiday.id || '';
    this.holidayName = holiday.holidayName || '';
    this.shift = holiday.shift || '';
    this.details = holiday.details || '';
    this.date = holiday.date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.location = holiday.location || '';
    this.holidayType = holiday.holidayType || '';
    this.createdBy = holiday.createdBy || '';
    this.creationDate =
      holiday.creationDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.approvalStatus = holiday.approvalStatus || '';
  }
}
