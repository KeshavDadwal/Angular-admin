export class TransportFee {
  id: string;
  student_name: string;
  student_id: string;
  class_section: string;
  route_name: string;
  amount: string;
  payment_date: string;
  payment_method: string;
  status: string;
  img: string;

  constructor(fee: Partial<TransportFee>) {
    this.id = fee.id || '';
    this.student_name = fee.student_name || '';
    this.student_id = fee.student_id || '';
    this.class_section = fee.class_section || '';
    this.route_name = fee.route_name || '';
    this.amount = fee.amount || '';
    this.payment_date = fee.payment_date || '';
    this.payment_method = fee.payment_method || '';
    this.status = fee.status || '';
    this.img = fee.img || 'assets/images/user/user1.jpg';
  }
}
