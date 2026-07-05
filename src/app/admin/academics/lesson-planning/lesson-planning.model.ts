export class LessonPlanning {
  id: string;
  topicName: string;
  lessonName: string;
  className: string;
  subjectName: string;
  teacherName: string;
  lessonDate: string;
  status: string;
  objectives: string;
  teachingMethod: string;

  constructor(lessonPlanning: Partial<LessonPlanning> = {}) {
    this.id = lessonPlanning.id || '';
    this.topicName = lessonPlanning.topicName || '';
    this.lessonName = lessonPlanning.lessonName || '';
    this.className = lessonPlanning.className || '';
    this.subjectName = lessonPlanning.subjectName || '';
    this.teacherName = lessonPlanning.teacherName || '';
    this.lessonDate = lessonPlanning.lessonDate || '';
    this.status = lessonPlanning.status || 'Planned';
    this.objectives = lessonPlanning.objectives || '';
    this.teachingMethod = lessonPlanning.teachingMethod || '';
  }
}
