import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { HolidayService } from '../../holiday.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  holiday_name: string;
  date: string;
  holiday_type: string;
}

@Component({
  selector: 'app-all-holidays-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    DatePipe,
  ],
})
export class AllHolidaysDeleteComponent {
  dialogRef = inject<MatDialogRef<AllHolidaysDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  holidayService = inject(HolidayService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.holidayService.deleteHoliday(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
