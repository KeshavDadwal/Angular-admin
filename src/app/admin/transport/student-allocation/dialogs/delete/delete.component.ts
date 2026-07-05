import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { StudentAllocationService } from '../../student-allocation.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-allocation-delete',
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
export class AllocationDeleteComponent {
  dialogRef = inject<MatDialogRef<AllocationDeleteComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  allocationService = inject(StudentAllocationService);

  confirmDelete(): void {
    this.allocationService.deleteAllocation(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
