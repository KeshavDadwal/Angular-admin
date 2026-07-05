export class FeesDiscount {
  discountId: string;
  discountType: string;
  discountAmount: number;
  discountPercentage: number;
  discountCode: string;
  startDate: string;
  endDate: string;
  appliedDate: string;
  status: string;
  remarks: string;

  constructor(discountData: Partial<FeesDiscount> = {}) {
    this.discountId = discountData.discountId || '';
    this.discountType = discountData.discountType || '';
    this.discountAmount = discountData.discountAmount || 0;
    this.discountPercentage = discountData.discountPercentage || 0;
    this.discountCode = discountData.discountCode || '';
    this.startDate = discountData.startDate || '';
    this.endDate = discountData.endDate || '';
    this.appliedDate = discountData.appliedDate || '';
    this.status = discountData.status || 'Active';
    this.remarks = discountData.remarks || '';
  }
}
