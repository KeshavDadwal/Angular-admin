export interface IExamReport {
  id: string;
  img: string;
  examName: string;
  className: string;
  subject: string;
  examDate: string;
  passPercentage: number;
  averageMarks: number;
  generatedBy: string;
  date: string;
  status: string;
}

export class ExamReport implements IExamReport {
  id: string;
  img: string;
  examName: string;
  className: string;
  subject: string;
  examDate: string;
  passPercentage: number;
  averageMarks: number;
  generatedBy: string;
  date: string;
  status: string;

  constructor(report: Partial<ExamReport> = {}) {
    this.id = report.id || '';
    this.img = report.img || 'assets/images/user/new.jpg';
    this.examName = report.examName || '';
    this.className = report.className || '';
    this.subject = report.subject || '';
    this.examDate = report.examDate || '';
    this.passPercentage = report.passPercentage || 0;
    this.averageMarks = report.averageMarks || 0;
    this.generatedBy = report.generatedBy || '';
    this.date = report.date || '';
    this.status = report.status || '';
  }
}
