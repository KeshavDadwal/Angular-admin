export class FeesType {
  feeTypeId: string;
  feeTypeName: string;
  category: string;
  description: string;
  amount: number;
  applicableClasses: string;
  frequency: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;

  constructor(feeTypeData: Partial<FeesType> = {}) {
    this.feeTypeId = feeTypeData.feeTypeId || '';
    this.feeTypeName = feeTypeData.feeTypeName || '';
    this.category = feeTypeData.category || '';
    this.description = feeTypeData.description || '';
    this.amount = feeTypeData.amount || 0;
    this.applicableClasses = feeTypeData.applicableClasses || '';
    this.frequency = feeTypeData.frequency || '';
    this.status = feeTypeData.status || 'Active';
    this.createdBy = feeTypeData.createdBy || '';
    this.createdDate = feeTypeData.createdDate || '';
    this.lastUpdated = feeTypeData.lastUpdated || '';
  }
}
