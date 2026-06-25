import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { StudentsService } from '../../students.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: string;
  name: string;
  department: string;
  mobile: string;
}

@Component({
    selector: 'app-students-delete',
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
export class StudentsDeleteComponent {
  dialogRef = inject<MatDialogRef<StudentsDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  studentsService = inject(StudentsService);

  confirmDelete(): void {
    this.studentsService.deleteStudent(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
