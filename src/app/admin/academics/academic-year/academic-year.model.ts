export class AcademicYear {
  id: string;
  academicYear: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  department: string;

  constructor(academicYear: Partial<AcademicYear> = {}) {
    this.id = academicYear.id || '';
    this.academicYear = academicYear.academicYear || '';
    this.status = academicYear.status || 'Active';
    this.startDate = academicYear.startDate || '';
    this.endDate = academicYear.endDate || '';
    this.description = academicYear.description || '';
    this.department = academicYear.department || 'All';
  }
}
