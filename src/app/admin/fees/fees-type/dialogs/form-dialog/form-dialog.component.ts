import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { FeesTypeService } from '../../fees-type.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeesType } from '../../fees-type.model';
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
  feesType: FeesType;
}

@Component({
  selector: 'app-all-fees-types-form',
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
export class AllFeesTypesFormComponent {
  dialogRef = inject<MatDialogRef<AllFeesTypesFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feesTypeService = inject(FeesTypeService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  feesTypeForm: UntypedFormGroup;
  feesType: FeesType;

  constructor() {
    const data = this.data;
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? data.feesType.feeTypeName : 'New Fee Type';
    this.feesType = this.action === 'edit' ? data.feesType : new FeesType({});
    this.feesTypeForm = this.createFeesTypeForm();
  }

  createFeesTypeForm(): UntypedFormGroup {
    return this.fb.group({
      feeTypeId: [this.feesType.feeTypeId],
      feeTypeName: [
        this.feesType.feeTypeName,
        [Validators.required, Validators.maxLength(100)],
      ],
      category: [
        this.feesType.category,
        [Validators.required, Validators.maxLength(50)],
      ],
      description: [this.feesType.description, [Validators.maxLength(500)]],
      amount: [
        this.feesType.amount,
        [Validators.required, Validators.min(0), Validators.max(100000)],
      ],
      applicableClasses: [
        this.feesType.applicableClasses,
        [Validators.maxLength(200)],
      ],
      frequency: [
        this.feesType.frequency || 'Annually',
        [Validators.required, Validators.maxLength(50)],
      ],
      status: [
        this.feesType.status || 'Active',
        [Validators.required, Validators.maxLength(50)],
      ],
      createdBy: [this.feesType.createdBy || 'Admin', [Validators.maxLength(100)]],
      createdDate: [
        this.feesType.createdDate
          ? formatDate(this.feesType.createdDate, 'yyyy-MM-dd', 'en')
          : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      ],
      lastUpdated: [
        this.feesType.lastUpdated
          ? formatDate(this.feesType.lastUpdated, 'yyyy-MM-dd', 'en')
          : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      ],
    });
  }

  submit(): void {
    if (this.feesTypeForm.valid) {
      const formData = this.feesTypeForm.getRawValue();
      if (this.action === 'edit') {
        this.feesTypeService.updateFeesType(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.feesTypeService.addFeesType(formData).subscribe({
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
