export class Allocation {
  id: string;
  img: string;
  student_name: string;
  roll_no: string;
  hostel_name: string;
  room_no: string;
  room_type: string;
  allocation_date: string;
  status: string;

  constructor(allocation: Partial<Allocation> = {}) {
    this.id = allocation.id || '';
    this.img = allocation.img || 'assets/images/user/new.jpg';
    this.student_name = allocation.student_name || '';
    this.roll_no = allocation.roll_no || '';
    this.hostel_name = allocation.hostel_name || '';
    this.room_no = allocation.room_no || '';
    this.room_type = allocation.room_type || '';
    this.allocation_date = allocation.allocation_date || '';
    this.status = allocation.status || 'Active';
  }
}
