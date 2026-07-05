import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { FeesTypeService } from '../../fees-type.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  feeTypeId: string;
  feeTypeName: string;
  category: string;
  amount: string;
}

@Component({
  selector: 'app-all-fees-types-delete',
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
export class AllFeesTypesDeleteComponent {
  dialogRef = inject<MatDialogRef<AllFeesTypesDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feesTypeService = inject(FeesTypeService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.feesTypeService.deleteFeesType(this.data.feeTypeId).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
