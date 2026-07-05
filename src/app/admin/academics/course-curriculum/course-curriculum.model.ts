export class CourseCurriculum {
  id: string;
  courseName: string;
  className: string;
  subjectName: string;
  description: string;
  status: string;
  duration: string;
  referenceMaterial: string;

  constructor(courseCurriculum: Partial<CourseCurriculum> = {}) {
    this.id = courseCurriculum.id || '';
    this.courseName = courseCurriculum.courseName || '';
    this.className = courseCurriculum.className || '';
    this.subjectName = courseCurriculum.subjectName || '';
    this.description = courseCurriculum.description || '';
    this.status = courseCurriculum.status || 'Active';
    this.duration = courseCurriculum.duration || '';
    this.referenceMaterial = courseCurriculum.referenceMaterial || '';
  }
}
