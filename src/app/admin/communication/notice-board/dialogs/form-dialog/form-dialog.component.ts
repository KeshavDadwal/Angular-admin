import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoticeBoard } from '../../notice-board.model';
import { NoticeBoardService } from '../../notice-board.service';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

export interface DialogData {
  id: string;
  action: string;
  noticeBoard: NoticeBoard;
}

@Component({
  selector: 'app-notice-board-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDialogClose,
    MatDatepickerModule
  ]
})
export class NoticeBoardFormComponent {
  dialogRef = inject<MatDialogRef<NoticeBoardFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  noticeBoardService = inject(NoticeBoardService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  noticeBoardForm: UntypedFormGroup;
  noticeBoard: NoticeBoard;

  constructor() {
    const data = this.data;
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? data.noticeBoard.title : 'New Notice Board';
    this.noticeBoard = this.action === 'edit' ? data.noticeBoard : new NoticeBoard({});
    this.noticeBoardForm = this.createNoticeBoardForm();
  }

  createNoticeBoardForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.noticeBoard.id],
      img: [this.noticeBoard.img],
      title: [this.noticeBoard.title, [Validators.required]],
      description: [this.noticeBoard.description, [Validators.required]],
      department: [this.noticeBoard.department, [Validators.required]],
      priority: [this.noticeBoard.priority, [Validators.required]],
      targetAudience: [this.noticeBoard.targetAudience, [Validators.required]],
      status: [this.noticeBoard.status, [Validators.required]],
      postedBy: [this.noticeBoard.postedBy, [Validators.required]],
      date: [this.noticeBoard.date, [Validators.required]],
    });
  }

  submit(): void {
    if (this.noticeBoardForm.valid) {
      const formData = this.noticeBoardForm.getRawValue();
      if (this.action === 'edit') {
        this.noticeBoardService.updateNoticeBoard(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.noticeBoardService.addNoticeBoard(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.submit();
  }
}
