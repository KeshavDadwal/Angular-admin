import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { LeaveBalanceService } from '../leave-balance.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  prev: string;
  current: string;
  name: string;
}

@Component({
  selector: 'app-leave-balance-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class LeaveBalanceDeleteComponent {
  dialogRef = inject<MatDialogRef<LeaveBalanceDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  leaveBalanceService = inject(LeaveBalanceService);

  confirmDelete(): void {
    this.leaveBalanceService.deleteLeaveBalance(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
