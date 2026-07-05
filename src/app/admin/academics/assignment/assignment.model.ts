export class Assignment {
  id: string;
  className: string;
  subjectName: string;
  teacherName: string;
  assignmentDate: string;
  status: string;
  title: string;
  deadline: string;
  details: string;

  constructor(assignment: Partial<Assignment> = {}) {
    this.id = assignment.id || '';
    this.className = assignment.className || '';
    this.subjectName = assignment.subjectName || '';
    this.teacherName = assignment.teacherName || '';
    this.assignmentDate = assignment.assignmentDate || '';
    this.status = assignment.status || 'Active';
    this.title = assignment.title || '';
    this.deadline = assignment.deadline || '';
    this.details = assignment.details || '';
  }
}
