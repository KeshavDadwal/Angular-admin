import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UserManagementService } from '../../user-management.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagement } from '../../user-management.model';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  userManagement: UserManagement;
}

@Component({
  selector: 'app-user-management-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [MatButtonModule, MatIconModule, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDialogClose],
})
export class UserManagementFormComponent {
  dialogRef = inject<MatDialogRef<UserManagementFormComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  userManagementService = inject(UserManagementService);
  private fb = inject(UntypedFormBuilder);

  action: string;
  dialogTitle: string;
  userManagementForm: UntypedFormGroup;
  userManagement: UserManagement;

  rolesList: string[] = ['Super Admin', 'Admin', 'Teacher', 'Accountant', 'Librarian', 'Registrar', 'Exam Controller', 'HR Manager', 'IT Support', 'Coordinator'];
  departmentsList: string[] = ['Administration', 'Academics', 'Finance', 'Science', 'Mathematics', 'Arts', 'Library', 'IT', 'Exams', 'Sports', 'History'];

  constructor() {
    const data = this.data;
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? data.userManagement.fullName : 'New User';
    this.userManagement = this.action === 'edit' ? data.userManagement : new UserManagement({} as UserManagement);
    this.userManagementForm = this.createUserManagementForm();
  }

  createUserManagementForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.userManagement.id],
      img: [this.userManagement.img],
      username: [this.userManagement.username, [Validators.required]],
      fullName: [this.userManagement.fullName, [Validators.required]],
      email: [this.userManagement.email, [Validators.required, Validators.email]],
      role: [this.userManagement.role, [Validators.required]],
      phone: [this.userManagement.phone, [Validators.required]],
      department: [this.userManagement.department, [Validators.required]],
      status: [this.userManagement.status, [Validators.required]],
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  submit(): void {
    if (this.userManagementForm.valid) {
      const formData = this.userManagementForm.getRawValue();
      if (this.action === 'edit') {
        this.userManagementService.updateUser(formData).subscribe({
          next: (response) => { this.dialogRef.close(response); },
          error: (error) => { console.error('Update Error:', error); },
        });
      } else {
        this.userManagementService.addUser(formData).subscribe({
          next: (response) => { this.dialogRef.close(response); },
          error: (error) => { console.error('Add Error:', error); },
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
