export interface ICustomReport {
  id: string;
  reportName: string;
  description: string;
  category: string;
  createdBy: string;
  date: string;
  status: string;
}

export class CustomReport implements ICustomReport {
  id: string;
  reportName: string;
  description: string;
  category: string;
  createdBy: string;
  date: string;
  status: string;

  constructor(report: Partial<CustomReport> = {}) {
    this.id = report.id || '';
    this.reportName = report.reportName || '';
    this.description = report.description || '';
    this.category = report.category || '';
    this.createdBy = report.createdBy || '';
    this.date = report.date || '';
    this.status = report.status || '';
  }
}
