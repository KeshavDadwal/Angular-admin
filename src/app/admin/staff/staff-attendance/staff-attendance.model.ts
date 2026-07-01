export class StaffAttendance {
  id: string;
  img: string;
  name: string;
  employee_id: string;
  designation: string;
  date: string;
  check_in: string;
  break: string;
  check_out: string;
  total: string;
  shift: string;
  late_arrival: string;
  early_departure: string;
  absence_reason: string;
  overtime: string;
  total_breaks: string;
  remarks: string;
  attendance_status: string;
  department: string;

  constructor(sa: Partial<StaffAttendance>) {
    this.id              = sa.id              || '';
    this.img             = sa.img             || 'assets/images/user/new.jpg';
    this.name            = sa.name            || '';
    this.employee_id     = sa.employee_id     || '';
    this.designation     = sa.designation     || '';
    this.date            = sa.date            || '';
    this.check_in        = sa.check_in        || '';
    this.break           = sa.break           || '';
    this.check_out       = sa.check_out       || '';
    this.total           = sa.total           || '';
    this.shift           = sa.shift           || '';
    this.late_arrival    = sa.late_arrival    || '';
    this.early_departure = sa.early_departure || '';
    this.absence_reason  = sa.absence_reason  || '';
    this.overtime        = sa.overtime        || '';
    this.total_breaks    = sa.total_breaks    || '';
    this.remarks         = sa.remarks         || '';
    this.attendance_status = sa.attendance_status || '';
    this.department      = sa.department      || '';
  }
}
