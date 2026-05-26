import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { UserManagementService } from '../../user-management.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  fullName: string;
  username: string;
}

@Component({
  selector: 'app-user-management-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
})
export class UserManagementDeleteComponent {
  dialogRef = inject<MatDialogRef<UserManagementDeleteComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  userManagementService = inject(UserManagementService);

  confirmDelete(): void {
    this.userManagementService.deleteUser(this.data.id).subscribe({
      next: (response) => { this.dialogRef.close(response); },
      error: (error) => { console.error('Delete Error:', error); },
    });
  }
}
