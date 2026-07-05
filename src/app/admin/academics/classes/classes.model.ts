export class Classes {
  id: string;
  className: string;
  section: string;
  academicYear: string;
  teacher: string;
  status: string;
  studentCount: string;
  roomNumber: string;

  constructor(classes: Partial<Classes> = {}) {
    this.id = classes.id || '';
    this.className = classes.className || '';
    this.section = classes.section || '';
    this.academicYear = classes.academicYear || '';
    this.teacher = classes.teacher || '';
    this.status = classes.status || 'Active';
    this.studentCount = classes.studentCount || '';
    this.roomNumber = classes.roomNumber || '';
  }
}
