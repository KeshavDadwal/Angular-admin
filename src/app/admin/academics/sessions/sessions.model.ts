export class Session {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  status: string;
  instructor: string;
  room: string;

  constructor(session: Partial<Session> = {}) {
    this.id = session.id || '';
    this.sessionName = session.sessionName || '';
    this.startDate = session.startDate || '';
    this.endDate = session.endDate || '';
    this.status = session.status || 'Active';
    this.instructor = session.instructor || '';
    this.room = session.room || '';
  }
}
