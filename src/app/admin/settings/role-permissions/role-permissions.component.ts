import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { RolePermissionService } from './role-permission.service';
import { RolePermission, PermissionModule } from './role-permission.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss'],
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule,
  ],
})
export class RolePermissionsComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private roleService = inject(RolePermissionService);
  private snackBar = inject(MatSnackBar);

  roles: RolePermission[] = [];
  selectedRole?: RolePermission;
  roleForm!: UntypedFormGroup;
  isLoading = true;

  breadscrums = [{ title: 'Role & Permissions', items: ['Settings'], active: 'Role & Permissions' }];

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.isLoading = true;
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (this.roles.length > 0) {
          this.selectRole(this.roles[0]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  selectRole(role: RolePermission) {
    this.selectedRole = role;
    this.initForm(role);
  }

  initForm(role: RolePermission) {
    this.roleForm = this.fb.group({
      id: [role.id],
      roleName: [role.roleName, Validators.required],
      description: [role.description],
      priorityLevel: [role.priorityLevel],
      status: [role.status],
    });
  }

  togglePermission(module: PermissionModule, pType: 'view' | 'create' | 'edit' | 'delete') {
    module[pType] = !module[pType];
  }

  saveRole() {
    if (this.roleForm.valid && this.selectedRole) {
      const updatedRole = {
        ...this.selectedRole,
        ...this.roleForm.value,
        modules: this.selectedRole.modules
      };
      
      console.log('Saving Role:', updatedRole);
      this.snackBar.open('Role and Permissions Updated Successfully!', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-success',
      });

      // Update local list
      const index = this.roles.findIndex(r => r.id === updatedRole.id);
      if (index !== -1) {
        this.roles[index] = updatedRole as RolePermission;
      }
    }
  }

  addRole() {
    const newRole = new RolePermission({
      roleName: 'New Role',
      description: 'Role description',
      modules: [
        { module: 'Students', view: false, create: false, edit: false, delete: false },
        { module: 'Teachers', view: false, create: false, edit: false, delete: false },
        { module: 'Academics', view: false, create: false, edit: false, delete: false },
        { module: 'Finance', view: false, create: false, edit: false, delete: false },
      ]
    });
    this.roles.push(newRole);
    this.selectRole(newRole);
  }
}
