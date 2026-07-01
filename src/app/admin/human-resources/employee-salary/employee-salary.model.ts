export class EmployeeSalary {
  id: string;
  img: string;
  name: string;
  email: string;
  payslip: string;
  role: string;
  empID: string;
  department: string;
  salary: string;
  bonus: string;
  deductions: string;
  netSalary: string;

  constructor(employeeSalary: Partial<EmployeeSalary>) {
    this.id = employeeSalary.id || '';
    this.img = employeeSalary.img || 'assets/images/user/new.jpg';
    this.name = employeeSalary.name || '';
    this.email = employeeSalary.email || '';
    this.payslip = employeeSalary.payslip || '';
    this.role = employeeSalary.role || '';
    this.empID = employeeSalary.empID || '';
    this.department = employeeSalary.department || '';
    this.salary = employeeSalary.salary || '';
    this.bonus = employeeSalary.bonus || '';
    this.deductions = employeeSalary.deductions || '';
    this.netSalary = employeeSalary.netSalary || '';
  }
}
