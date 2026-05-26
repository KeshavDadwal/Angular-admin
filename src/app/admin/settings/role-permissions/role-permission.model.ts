export interface PermissionModule {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface IRolePermission {
  id: number;
  roleName: string;
  description: string;
  usersCount: number;
  priorityLevel: string;
  status: string;
  modules: PermissionModule[];
}

export class RolePermission implements IRolePermission {
  id: number;
  roleName: string;
  description: string;
  usersCount: number;
  priorityLevel: string;
  status: string;
  modules: PermissionModule[];

  constructor(role: Partial<RolePermission>) {
    this.id = role.id || this.getRandomID();
    this.roleName = role.roleName || '';
    this.description = role.description || '';
    this.usersCount = role.usersCount || 0;
    this.priorityLevel = role.priorityLevel || 'Low';
    this.status = role.status || 'Active';
    this.modules = role.modules || [];
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
