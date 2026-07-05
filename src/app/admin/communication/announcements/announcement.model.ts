export interface IAnnouncement {
  id: string;
  img: string;
  title: string;
  announcementType: string;
  postedBy: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  priority: string;
}

export class Announcement implements IAnnouncement {
  id: string;
  img: string;
  title: string;
  announcementType: string;
  postedBy: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  priority: string;

  constructor(announcement: Partial<Announcement>) {
    this.id = announcement.id || '';
    this.img = announcement.img || 'assets/images/user/new.jpg';
    this.title = announcement.title || '';
    this.announcementType = announcement.announcementType || '';
    this.postedBy = announcement.postedBy || '';
    this.startDate = announcement.startDate || '';
    this.endDate = announcement.endDate || '';
    this.status = announcement.status || '';
    this.description = announcement.description || '';
    this.priority = announcement.priority || '';
  }
}
