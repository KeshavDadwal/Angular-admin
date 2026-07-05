import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { FeesDiscountService } from '../../fees-discount.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeesDiscount } from '../../fees-discount.model';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  id: string;
  action: string;
  feesDiscount: FeesDiscount;
}

@Component({
  selector: 'app-all-fees-discounts-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
  ],
})
export class AllFeesDiscountsFormComponent {
  dialogRef = inject<MatDialogRef<AllFeesDiscountsFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feesDiscountService = inject(FeesDiscountService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  feesDiscountForm: UntypedFormGroup;
  feesDiscount: FeesDiscount;

  constructor() {
    const data = this.data;
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? data.feesDiscount.discountType : 'New Fee Discount';
    this.feesDiscount = this.action === 'edit' ? data.feesDiscount : new FeesDiscount({});
    this.feesDiscountForm = this.createFeesDiscountForm();
  }

  createFeesDiscountForm(): UntypedFormGroup {
    return this.fb.group({
      discountId: [this.feesDiscount.discountId],
      discountType: [
        this.feesDiscount.discountType,
        [Validators.required, Validators.maxLength(50)],
      ],
      discountAmount: [
        this.feesDiscount.discountAmount,
        [Validators.min(0), Validators.max(10000)],
      ],
      discountPercentage: [
        this.feesDiscount.discountPercentage,
        [Validators.min(0), Validators.max(100)],
      ],
      discountCode: [
        this.feesDiscount.discountCode,
        [Validators.required, Validators.maxLength(20)],
      ],
      startDate: [
        this.feesDiscount.startDate
          ? formatDate(this.feesDiscount.startDate, 'yyyy-MM-dd', 'en')
          : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      endDate: [
        this.feesDiscount.endDate
          ? formatDate(this.feesDiscount.endDate, 'yyyy-MM-dd', 'en')
          : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      appliedDate: [
        this.feesDiscount.appliedDate
          ? formatDate(this.feesDiscount.appliedDate, 'yyyy-MM-dd', 'en')
          : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      ],
      status: [
        this.feesDiscount.status || 'Active',
        [Validators.required, Validators.maxLength(50)],
      ],
      remarks: [this.feesDiscount.remarks, [Validators.maxLength(500)]],
    });
  }

  submit(): void {
    if (this.feesDiscountForm.valid) {
      const formData = this.feesDiscountForm.getRawValue();
      if (this.action === 'edit') {
        this.feesDiscountService.updateFeesDiscount(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.feesDiscountService.addFeesDiscount(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.submit();
  }
}
