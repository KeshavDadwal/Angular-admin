import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { TransportFeeService } from '../../transport-fees.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fees-delete',
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
export class FeesDeleteComponent {
  dialogRef = inject<MatDialogRef<FeesDeleteComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  feeService = inject(TransportFeeService);

  confirmDelete(): void {
    this.feeService.deleteFee(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
