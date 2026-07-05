import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { NoticeBoardService } from '../../notice-board.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  title: string;
  postedBy: string;
  department: string;
}

@Component({
  selector: 'app-notice-board-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ]
})
export class NoticeBoardDeleteComponent {
  dialogRef = inject<MatDialogRef<NoticeBoardDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  noticeBoardService = inject(NoticeBoardService);

  confirmDelete(): void {
    this.noticeBoardService.deleteNoticeBoard(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
