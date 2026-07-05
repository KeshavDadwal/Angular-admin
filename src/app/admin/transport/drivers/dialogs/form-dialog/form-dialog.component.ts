import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Driver } from '../../drivers.model';
import { DriverService } from '../../drivers.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

export interface DialogData {
  id: string;
  action: string;
  driver: Driver;
}

@Component({
  selector: 'app-drivers-form',
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
export class DriversFormComponent {
  dialogRef = inject<MatDialogRef<DriversFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  driverService = inject(DriverService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  driverForm: UntypedFormGroup;
  driver: Driver;

  constructor() {
    this.action = this.data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Driver';
      this.driver = this.data.driver;
    } else {
      this.dialogTitle = 'New Driver';
      this.driver = new Driver({});
    }
    this.driverForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.driver.id],
      driver_name: [this.driver.driver_name, [Validators.required]],
      license_no: [this.driver.license_no, [Validators.required]],
      phone: [this.driver.phone, [Validators.required]],
      joining_date: [this.driver.joining_date, [Validators.required]],
      address: [this.driver.address, [Validators.required]],
      experience: [this.driver.experience, [Validators.required]],
      status: [this.driver.status, [Validators.required]],
      img: [this.driver.img],
    });
  }

  submit() {
    if (this.driverForm.valid) {
      if (this.action === 'edit') {
        this.driverService.updateDriver(this.driverForm.getRawValue()).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.driverService.addDriver(this.driverForm.getRawValue()).subscribe({
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
