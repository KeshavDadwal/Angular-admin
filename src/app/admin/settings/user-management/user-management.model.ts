export interface IUserManagement {
  id: number;
  img: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  lastLogin: string;
  status: string;
}

export class UserManagement implements IUserManagement {
  id: number;
  img: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  lastLogin: string;
  status: string;

  constructor(user: Partial<UserManagement>) {
    this.id = user.id || this.getRandomID();
    this.img = user.img || 'assets/images/user/new.jpg';
    this.username = user.username || '';
    this.fullName = user.fullName || '';
    this.email = user.email || '';
    this.role = user.role || '';
    this.phone = user.phone || '';
    this.department = user.department || '';
    this.lastLogin = user.lastLogin || '';
    this.status = user.status || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
