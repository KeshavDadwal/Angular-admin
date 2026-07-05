import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { DriverService } from '../../drivers.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-drivers-delete',
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
export class DriversDeleteComponent {
  dialogRef = inject<MatDialogRef<DriversDeleteComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  driverService = inject(DriverService);

  confirmDelete(): void {
    this.driverService.deleteDriver(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
