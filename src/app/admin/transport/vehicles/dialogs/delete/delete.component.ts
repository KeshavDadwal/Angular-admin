import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { VehicleService } from '../../vehicles.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicles-delete',
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
export class VehiclesDeleteComponent {
  dialogRef = inject<MatDialogRef<VehiclesDeleteComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  vehicleService = inject(VehicleService);

  confirmDelete(): void {
    this.vehicleService.deleteVehicle(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
