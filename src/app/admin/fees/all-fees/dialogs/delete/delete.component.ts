import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { FeesService } from '../../fees.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  rollNo: string;
  studentName: string;
}

@Component({
  selector: 'app-all-fees-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class AllFeesDeleteComponent {
  dialogRef = inject<MatDialogRef<AllFeesDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feesService = inject(FeesService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.feesService.deleteFees(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
