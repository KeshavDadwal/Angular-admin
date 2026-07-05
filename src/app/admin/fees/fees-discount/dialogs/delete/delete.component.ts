import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { FeesDiscountService } from '../../fees-discount.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  discountId: string;
  discountType: string;
  discountPercentage: string;
}

@Component({
  selector: 'app-all-fees-discounts-delete',
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
export class AllFeesDiscountsDeleteComponent {
  dialogRef = inject<MatDialogRef<AllFeesDiscountsDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feesDiscountService = inject(FeesDiscountService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.feesDiscountService.deleteFeesDiscount(this.data.discountId).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
