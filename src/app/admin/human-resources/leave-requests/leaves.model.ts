import { formatDate } from '@angular/common';

export class Leaves {
  id: string;
  img: string;
  name: string;
  employeeId: string;
  department: string;
  type: string;
  from: string;
  leaveTo: string;
  noOfDays: string;
  durationType: string;
  status: string;
  reason: string;
  note: string;
  requestedOn: string;
  approvedBy: string;
  approvalDate: string;

  constructor(leaves: Partial<Leaves>) {
    this.id = leaves.id || '';
    this.img = leaves.img || 'assets/images/user/new.jpg';
    this.name = leaves.name || '';
    this.employeeId = leaves.employeeId || '';
    this.department = leaves.department || '';
    this.type = leaves.type || '';
    this.from = leaves.from || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.leaveTo = leaves.leaveTo || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.noOfDays = leaves.noOfDays || '';
    this.durationType = leaves.durationType || 'Full-day';
    this.status = leaves.status || 'Pending';
    this.reason = leaves.reason || '';
    this.note = leaves.note || '';
    this.requestedOn = leaves.requestedOn || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.approvedBy = leaves.approvedBy || '';
    this.approvalDate = leaves.approvalDate || '';
  }
}
