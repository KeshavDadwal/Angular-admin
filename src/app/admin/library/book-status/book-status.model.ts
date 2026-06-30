import { formatDate } from '@angular/common';

export class BookStatus {
  bookStatusID: string | number;
  bookID: string | number;
  bookName: string;
  status: string;
  dateUpdated: string;
  lastCheckedOutDate: string;
  dueDate: string;
  checkedOutBy: string;
  reservedBy: string;
  condition: string;
  returnDate: string;
  notes: string;

  constructor(bookStatusData: Partial<BookStatus> = {}) {
    this.bookStatusID = bookStatusData.bookStatusID || '';
    this.bookID = bookStatusData.bookID || '';
    this.bookName = bookStatusData.bookName || '';
    this.status = bookStatusData.status || 'Available';
    this.dateUpdated =
      bookStatusData.dateUpdated || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.lastCheckedOutDate =
      bookStatusData.lastCheckedOutDate || '';
    this.dueDate = bookStatusData.dueDate || '';
    this.checkedOutBy = bookStatusData.checkedOutBy || '';
    this.reservedBy = bookStatusData.reservedBy || '';
    this.condition = bookStatusData.condition || 'Good';
    this.returnDate = bookStatusData.returnDate || '';
    this.notes = bookStatusData.notes || '';
  }
}
