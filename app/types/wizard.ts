export type UserRole = "admin" | "ops";
export type JobRole = "Ops" | "Admin" | "Engineer" | "Finance";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";

export interface WizardData {
  // Step 1
  fullName: string;
  email: string;
  department: string;
  jobRole: JobRole | "";
  employeeId: string;

  // Step 2
  photo: string; // Base64
  employmentType: EmploymentType | "";
  location: string;
  notes: string;
}
