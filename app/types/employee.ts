export interface BasicInfo {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
}

export interface DetailInfo {
  id: string;
  employeeId: string;
  photo: string;
  employmentType: string;
  location: string;
  notes: string;
}

export interface Employee extends Partial<BasicInfo>, Partial<DetailInfo> {
  employeeId: string;
}
