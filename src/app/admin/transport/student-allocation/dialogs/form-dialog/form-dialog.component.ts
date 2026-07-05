import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentAllocation } from '../../student-allocation.model';
import { StudentAllocationService } from '../../student-allocation.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

export interface DialogData {
  id: string;
  action: string;
  allocation: StudentAllocation;
}

@Component({
  selector: 'app-allocation-form',
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
export class AllocationFormComponent {
  dialogRef = inject<MatDialogRef<AllocationFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  allocationService = inject(StudentAllocationService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  allocationForm: UntypedFormGroup;
  allocation: StudentAllocation;

  constructor() {
    this.action = this.data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Allocation';
      this.allocation = this.data.allocation;
    } else {
      this.dialogTitle = 'New Allocation';
      this.allocation = new StudentAllocation({});
    }
    this.allocationForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.allocation.id],
      student_name: [this.allocation.student_name, [Validators.required]],
      student_id: [this.allocation.student_id, [Validators.required]],
      class_section: [this.allocation.class_section, [Validators.required]],
      route_name: [this.allocation.route_name, [Validators.required]],
      vehicle_no: [this.allocation.vehicle_no, [Validators.required]],
      stop_point: [this.allocation.stop_point, [Validators.required]],
      allocation_date: [this.allocation.allocation_date, [Validators.required]],
      status: [this.allocation.status, [Validators.required]],
      img: [this.allocation.img],
    });
  }

  submit() {
    if (this.allocationForm.valid) {
      if (this.action === 'edit') {
        this.allocationService.updateAllocation(this.allocationForm.getRawValue()).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.allocationService.addAllocation(this.allocationForm.getRawValue()).subscribe({
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
