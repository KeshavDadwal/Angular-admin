export class LibraryReport {
  id: string | number;
  report_name: string;
  generated_date: string;
  type: string;
  status: string;

  constructor(libraryReport: Partial<LibraryReport> = {}) {
    this.id = libraryReport.id || '';
    this.report_name = libraryReport.report_name || '';
    this.generated_date = libraryReport.generated_date || '';
    this.type = libraryReport.type || '';
    this.status = libraryReport.status || '';
  }
}
