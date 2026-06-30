export interface ResultGenerationData {
  id: string | number;
  exam_name: string;
  course: string;
  semester: string;
  result_date: string;
  status: string;
}

export class ResultGeneration implements ResultGenerationData {
  id: string | number;
  exam_name: string;
  course: string;
  semester: string;
  result_date: string;
  status: string;

  constructor(resultGeneration: Partial<ResultGenerationData>) {
    this.id = resultGeneration.id || '';
    this.exam_name = resultGeneration.exam_name || '';
    this.course = resultGeneration.course || '';
    this.semester = resultGeneration.semester || '';
    this.result_date = resultGeneration.result_date || '';
    this.status = resultGeneration.status || '';
  }
}
