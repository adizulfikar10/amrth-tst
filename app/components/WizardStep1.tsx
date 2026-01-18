import React from "react";
import { JOB_ROLES } from "~/constants/wizard";
import type { WizardData, JobRole } from "~/types/wizard";

interface WizardStep1Props {
  formData: WizardData;
  setFormData: React.Dispatch<React.SetStateAction<WizardData>>;
  deptOptions: { id: number; name: string }[];
  fetchDepts: (query: string) => void;
  generateEmployeeId: (deptName: string) => void;
  onNext: () => void;
  isValid: boolean;
}

export function WizardStep1({
  formData,
  setFormData,
  deptOptions,
  fetchDepts,
  generateEmployeeId,
  onNext,
  isValid,
}: WizardStep1Props) {
  return (
    <div className="step-container">
      <h2>Step 1: Basic Info</h2>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            borderColor:
              formData.email && !formData.email.includes("@")
                ? "red"
                : undefined,
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input
          id="department"
          type="text"
          value={formData.department}
          onChange={(e) => {
            setFormData({ ...formData, department: e.target.value });
            fetchDepts(e.target.value);
          }}
          onBlur={() => {
            // Trigger ID generation if valid dept
            if (formData.department) generateEmployeeId(formData.department);
          }}
          list="dept-list"
        />
        <datalist id="dept-list">
          {deptOptions.map((d) => (
            <option key={d.id} value={d.name} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={formData.jobRole}
          onChange={(e) =>
            setFormData({
              ...formData,
              jobRole: e.target.value as JobRole,
            })
          }
        >
          <option value="">Select Role</option>
          {JOB_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Employee ID (Auto)</label>
        <input type="text" value={formData.employeeId} readOnly disabled />
      </div>

      <div className="wizard-actions">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}
