export class HostelFee {
  id: string;
  img: string;
  student_name: string;
  roll_no: string;
  hostel_name: string;
  room_no: string;
  fee_type: string;
  amount: number;
  payment_date: string;
  payment_status: string;

  constructor(fee: Partial<HostelFee> = {}) {
    this.id = fee.id || '';
    this.img = fee.img || 'assets/images/user/new.jpg';
    this.student_name = fee.student_name || '';
    this.roll_no = fee.roll_no || '';
    this.hostel_name = fee.hostel_name || '';
    this.room_no = fee.room_no || '';
    this.fee_type = fee.fee_type || '';
    this.amount = fee.amount || 0;
    this.payment_date = fee.payment_date || '';
    this.payment_status = fee.payment_status || 'Paid';
  }
}
