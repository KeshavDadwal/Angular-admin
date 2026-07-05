export interface IAcademicReport {
  id: string;
  img: string;
  reportType: string;
  className: string;
  subject: string;
  academicYear: string;
  term: string;
  generatedBy: string;
  date: string;
  status: string;
}

export class AcademicReport implements IAcademicReport {
  id: string;
  img: string;
  reportType: string;
  className: string;
  subject: string;
  academicYear: string;
  term: string;
  generatedBy: string;
  date: string;
  status: string;

  constructor(report: Partial<AcademicReport> = {}) {
    this.id = report.id || '';
    this.img = report.img || 'assets/images/user/new.jpg';
    this.reportType = report.reportType || '';
    this.className = report.className || '';
    this.subject = report.subject || '';
    this.academicYear = report.academicYear || '';
    this.term = report.term || '';
    this.generatedBy = report.generatedBy || '';
    this.date = report.date || '';
    this.status = report.status || '';
  }
}
