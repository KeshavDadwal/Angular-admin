export class Department {
  id: string;
  img: string;
  department_name: string;
  hod: string;
  phone: string;
  email: string;
  student_capacity: string;
  establishedYear: string;
  totalFaculty: string;

  constructor(department: Partial<Department> = {}) {
    this.id = department.id || '';
    this.img = department.img || 'assets/images/user/new.jpg';
    this.department_name = department.department_name || '';
    this.hod = department.hod || '';
    this.phone = department.phone || '';
    this.email = department.email || '';
    this.student_capacity = department.student_capacity || '';
    this.establishedYear = department.establishedYear || '';
    this.totalFaculty = department.totalFaculty || '';
  }
}
