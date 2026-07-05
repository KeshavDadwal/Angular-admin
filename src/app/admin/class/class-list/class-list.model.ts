export class ClassList {
  classId: string;
  className: string;
  classCode: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  roomNumber: string;
  schedule: string;
  semester: string;
  classCapacity: number;
  status: string;
  description: string;
  classType: string;
  createdAt: string;
  updatedAt: string;

  constructor(classData: Partial<ClassList> = {}) {
    this.classId = classData.classId || '';
    this.className = classData.className || '';
    this.classCode = classData.classCode || '';
    this.teacherId = classData.teacherId || '';
    this.startDate = classData.startDate || '';
    this.endDate = classData.endDate || '';
    this.roomNumber = classData.roomNumber || '';
    this.schedule = classData.schedule || 'Not Scheduled';
    this.semester = classData.semester || '';
    this.classCapacity = classData.classCapacity || 0;
    this.status = classData.status || 'Active';
    this.description = classData.description || '';
    this.classType = classData.classType || 'Regular';
    this.createdAt = classData.createdAt || '';
    this.updatedAt = classData.updatedAt || '';
  }
}
