export class Subjects {
  id: string;
  subjectName: string;
  subjectCode: string;
  subjectType: string;
  status: string;
  prerequisites: string;
  credits: string;

  constructor(subjects: Partial<Subjects> = {}) {
    this.id = subjects.id || '';
    this.subjectName = subjects.subjectName || '';
    this.subjectCode = subjects.subjectCode || '';
    this.subjectType = subjects.subjectType || 'Core';
    this.status = subjects.status || 'Active';
    this.prerequisites = subjects.prerequisites || '';
    this.credits = subjects.credits || '';
  }
}
