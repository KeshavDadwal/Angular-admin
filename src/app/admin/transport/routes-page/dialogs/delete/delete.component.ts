import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { TransportRouteService } from '../../routes-page.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-routes-delete',
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
export class RoutesDeleteComponent {
  dialogRef = inject<MatDialogRef<RoutesDeleteComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  routeService = inject(TransportRouteService);

  confirmDelete(): void {
    this.routeService.deleteRoute(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
