export class LeaveBalance {
  id: string;
  img: string;
  name: string;
  prev: string;
  current: string;
  total: string;
  used: string;
  accepted: string;
  rejected: string;
  expired: string;
  carryOver: string;

  constructor(leaves: Partial<LeaveBalance>) {
    this.id = leaves.id || '';
    this.img = leaves.img || 'assets/images/user/new.jpg';
    this.name = leaves.name || '';
    this.prev = leaves.prev || '';
    this.current = leaves.current || '';
    this.total = leaves.total || '';
    this.used = leaves.used || '';
    this.accepted = leaves.accepted || '';
    this.rejected = leaves.rejected || '';
    this.expired = leaves.expired || '';
    this.carryOver = leaves.carryOver || '';
  }
}
