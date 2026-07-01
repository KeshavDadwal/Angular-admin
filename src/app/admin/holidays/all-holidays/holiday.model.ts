import { formatDate } from '@angular/common';

export class Holiday {
  id: string;
  holiday_name: string;
  date: string;
  location: string;
  shift: string;
  details: string;
  holiday_type: string;
  created_by: string;
  creation_date: string;
  approval_status: string;

  constructor(holiday: Partial<Holiday>) {
    this.id = holiday.id || '';
    this.holiday_name = holiday.holiday_name || '';
    this.date = holiday.date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.location = holiday.location || 'All Locations';
    this.shift = holiday.shift || 'All Shifts';
    this.details = holiday.details || '';
    this.holiday_type = holiday.holiday_type || '';
    this.created_by = holiday.created_by || 'Admin';
    this.creation_date = holiday.creation_date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.approval_status = holiday.approval_status || 'Pending';
  }
}
