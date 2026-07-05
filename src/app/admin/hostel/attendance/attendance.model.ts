export class Attendance {
  id: string;
  img: string;
  student_name: string;
  roll_no: string;
  hostel_name: string;
  room_no: string;
  attendance_date: string;
  status: string;
  note: string;

  constructor(attendance: Partial<Attendance> = {}) {
    this.id = attendance.id || '';
    this.img = attendance.img || 'assets/images/user/new.jpg';
    this.student_name = attendance.student_name || '';
    this.roll_no = attendance.roll_no || '';
    this.hostel_name = attendance.hostel_name || '';
    this.room_no = attendance.room_no || '';
    this.attendance_date = attendance.attendance_date || '';
    this.status = attendance.status || 'Present';
    this.note = attendance.note || '';
  }
}
