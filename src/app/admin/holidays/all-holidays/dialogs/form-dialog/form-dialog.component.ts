import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { HolidayService } from '../../holiday.service';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Holiday } from '../../holiday.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
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
  holiday: Holiday;
}

@Component({
  selector: 'app-all-holidays-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
  ],
})
export class AllHolidaysFormComponent {
  dialogRef = inject<MatDialogRef<AllHolidaysFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  holidayService = inject(HolidayService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  holidayForm: UntypedFormGroup;
  holiday: Holiday;

  constructor() {
    const data = this.data;
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? data.holiday.holiday_name : 'New Holiday';
    this.holiday = this.action === 'edit' ? data.holiday : new Holiday({});
    this.holidayForm = this.createHolidayForm();
  }

  createHolidayForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.holiday.id],
      holiday_name: [this.holiday.holiday_name, [Validators.required]],
      date: [
        formatDate(this.holiday.date || new Date(), 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      location: [this.holiday.location || 'All Locations'],
      shift: [this.holiday.shift || 'All Shifts'],
      details: [this.holiday.details],
      holiday_type: [this.holiday.holiday_type, [Validators.required]],
      created_by: [this.holiday.created_by || 'Admin'],
      creation_date: [
        formatDate(this.holiday.creation_date || new Date(), 'yyyy-MM-dd', 'en'),
      ],
      approval_status: [this.holiday.approval_status || 'Pending'],
    });
  }

  submit(): void {
    if (this.holidayForm.valid) {
      const formData = this.holidayForm.getRawValue();
      if (formData.date) {
        formData.date = formatDate(formData.date, 'yyyy-MM-dd', 'en');
      }
      if (formData.creation_date) {
        formData.creation_date = formatDate(formData.creation_date, 'yyyy-MM-dd', 'en');
      }
      if (this.action === 'edit') {
        this.holidayService.updateHoliday(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.holidayService.addHoliday(formData).subscribe({
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
