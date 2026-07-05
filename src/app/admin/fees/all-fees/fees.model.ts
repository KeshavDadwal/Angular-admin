export class Fees {
  id: string;
  rollNo: string;
  studentName: string;
  class: string;
  feesType: string;
  invoiceNo: string;
  paymentDueDate: string;
  paymentDate: string;
  paymentType: string;
  status: string;
  amount: string;
  lateFee: string;
  discount: string;
  createdAt: string;
  updatedAt: string;
  notes: string;

  constructor(fees: Partial<Fees>) {
    this.id = fees.id || '';
    this.rollNo = fees.rollNo || '';
    this.studentName = fees.studentName || '';
    this.class = fees.class || 'N/A';
    this.feesType = fees.feesType || '';
    this.invoiceNo = fees.invoiceNo || '';
    this.paymentDueDate = fees.paymentDueDate || '';
    this.paymentDate = fees.paymentDate || '';
    this.paymentType = fees.paymentType || '';
    this.status = fees.status || '';
    this.amount = fees.amount || '';
    this.lateFee = fees.lateFee || '0$';
    this.discount = fees.discount || '0$';
    this.createdAt = fees.createdAt || '';
    this.updatedAt = fees.updatedAt || '';
    this.notes = fees.notes || 'N/A';
  }
}
