export interface INoticeBoard {
  id: string;
  img: string;
  title: string;
  postedBy: string;
  department: string;
  date: string;
  priority: string;
  status: string;
  description: string;
  targetAudience: string;
}

export class NoticeBoard implements INoticeBoard {
  id: string;
  img: string;
  title: string;
  postedBy: string;
  department: string;
  date: string;
  priority: string;
  status: string;
  description: string;
  targetAudience: string;

  constructor(noticeBoard: Partial<NoticeBoard>) {
    this.id = noticeBoard.id || '';
    this.img = noticeBoard.img || 'assets/images/user/new.jpg';
    this.title = noticeBoard.title || '';
    this.postedBy = noticeBoard.postedBy || '';
    this.department = noticeBoard.department || '';
    this.date = noticeBoard.date || '';
    this.priority = noticeBoard.priority || '';
    this.status = noticeBoard.status || '';
    this.description = noticeBoard.description || '';
    this.targetAudience = noticeBoard.targetAudience || '';
  }
}
