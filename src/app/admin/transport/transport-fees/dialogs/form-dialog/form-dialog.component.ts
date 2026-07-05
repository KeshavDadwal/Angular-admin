import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransportFee } from '../../transport-fees.model';
import { TransportFeeService } from '../../transport-fees.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

export interface DialogData {
  id: string;
  action: string;
  fee: TransportFee;
}

@Component({
  selector: 'app-fees-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogClose,
    MatSelectModule,
    MatDatepickerModule
  ],
})
export class FeesFormComponent {
  dialogRef = inject<MatDialogRef<FeesFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  feeService = inject(TransportFeeService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  feeForm: UntypedFormGroup;
  fee: TransportFee;

  constructor() {
    this.action = this.data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Fee';
      this.fee = this.data.fee;
    } else {
      this.dialogTitle = 'New Fee';
      this.fee = new TransportFee({});
    }
    this.feeForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.fee.id],
      student_name: [this.fee.student_name, [Validators.required]],
      student_id: [this.fee.student_id, [Validators.required]],
      class_section: [this.fee.class_section, [Validators.required]],
      route_name: [this.fee.route_name, [Validators.required]],
      amount: [this.fee.amount, [Validators.required]],
      payment_date: [this.fee.payment_date, [Validators.required]],
      payment_method: [this.fee.payment_method, [Validators.required]],
      status: [this.fee.status, [Validators.required]],
      img: [this.fee.img],
    });
  }

  submit() {
    if (this.feeForm.valid) {
      if (this.action === 'edit') {
        this.feeService.updateFee(this.feeForm.getRawValue()).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.feeService.addFee(this.feeForm.getRawValue()).subscribe({
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
}
