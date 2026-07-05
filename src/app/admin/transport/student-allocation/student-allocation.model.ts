export class StudentAllocation {
  id: string;
  student_name: string;
  student_id: string;
  class_section: string;
  route_name: string;
  vehicle_no: string;
  stop_point: string;
  allocation_date: string;
  status: string;
  img: string;

  constructor(allocation: Partial<StudentAllocation>) {
    this.id = allocation.id || '';
    this.student_name = allocation.student_name || '';
    this.student_id = allocation.student_id || '';
    this.class_section = allocation.class_section || '';
    this.route_name = allocation.route_name || '';
    this.vehicle_no = allocation.vehicle_no || '';
    this.stop_point = allocation.stop_point || '';
    this.allocation_date = allocation.allocation_date || '';
    this.status = allocation.status || '';
    this.img = allocation.img || 'assets/images/user/user1.jpg';
  }
}
