export class StudentHealthRecord {
  id: string;
  img: string;
  student_name: string;
  blood_group: string;
  allergies: string;
  last_checkup: string;
  status: string;

  constructor(studentHealthRecord: Partial<StudentHealthRecord>) {
    this.id = studentHealthRecord.id || this.getRandomID();
    this.img = studentHealthRecord.img || 'assets/images/user/new.jpg';
    this.student_name = studentHealthRecord.student_name || '';
    this.blood_group = studentHealthRecord.blood_group || '';
    this.allergies = studentHealthRecord.allergies || '';
    this.last_checkup = studentHealthRecord.last_checkup || '';
    this.status = studentHealthRecord.status || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
}
