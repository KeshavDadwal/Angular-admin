export interface IFeeReport {
  id: string;
  img: string;
  reportType: string;
  feeCategory: string;
  dateFrom: string;
  dateTo: string;
  totalAmount: number;
  generatedBy: string;
  date: string;
  status: string;
}

export class FeeReport implements IFeeReport {
  id: string;
  img: string;
  reportType: string;
  feeCategory: string;
  dateFrom: string;
  dateTo: string;
  totalAmount: number;
  generatedBy: string;
  date: string;
  status: string;

  constructor(report: Partial<FeeReport> = {}) {
    this.id = report.id || '';
    this.img = report.img || 'assets/images/user/new.jpg';
    this.reportType = report.reportType || '';
    this.feeCategory = report.feeCategory || '';
    this.dateFrom = report.dateFrom || '';
    this.dateTo = report.dateTo || '';
    this.totalAmount = report.totalAmount || 0;
    this.generatedBy = report.generatedBy || '';
    this.date = report.date || '';
    this.status = report.status || '';
  }
}
