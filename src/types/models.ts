export interface User {
  id: string;
  name: string;
  email: string;
  tenantIds: string[];
}

export interface Tenant {
  id: string;
  name: string;
  userIds: string[];
}
