import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { EmployeeSalaryService } from '../../employee-salary.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  name: string;
  department: string;
  empID: string;
}

@Component({
  selector: 'app-employee-salary-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ]
})
export class EmployeeSalaryDeleteComponent {
  dialogRef = inject<MatDialogRef<EmployeeSalaryDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  employeeSalaryService = inject(EmployeeSalaryService);

  confirmDelete(): void {
    this.employeeSalaryService.deleteEmployeeSalary(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
