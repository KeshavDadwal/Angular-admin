export class StudentPromotion {
  id: string;
  img: string;
  student_name: string;
  rollNo: string;
  current_class: string;
  promoted_class: string;
  section: string;
  session: string;
  promotion_date: string;
  total_marks: number;
  obtained_marks: number;
  percentage: string;
  result: string;
  status: string;

  constructor(studentPromotion: Partial<StudentPromotion>) {
    this.id = studentPromotion.id || this.getRandomID();
    this.img = studentPromotion.img || 'assets/images/user/new.jpg';
    this.student_name = studentPromotion.student_name || '';
    this.rollNo = studentPromotion.rollNo || '';
    this.current_class = studentPromotion.current_class || '';
    this.promoted_class = studentPromotion.promoted_class || '';
    this.section = studentPromotion.section || '';
    this.session = studentPromotion.session || '';
    this.promotion_date = studentPromotion.promotion_date || '';
    this.total_marks = studentPromotion.total_marks || 0;
    this.obtained_marks = studentPromotion.obtained_marks || 0;
    this.percentage = studentPromotion.percentage || '';
    this.result = studentPromotion.result || '';
    this.status = studentPromotion.status || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
}
