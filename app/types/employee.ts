export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Ops';
  status: 'Active' | 'Inactive';
  email?: string; // Optional extra field
  avatar?: string; // Base64 image
}

export interface EmployeeResponse {
  employees: Employee[];
  total: number;
}
