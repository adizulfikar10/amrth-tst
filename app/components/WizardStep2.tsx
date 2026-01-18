import React from "react";
import { Avatar } from "~/components/Avatar";
import { EMPLOYMENT_TYPES } from "~/constants/wizard";
import type { WizardData, EmploymentType, UserRole } from "~/types/wizard";

interface WizardStep2Props {
  formData: WizardData;
  setFormData: React.Dispatch<React.SetStateAction<WizardData>>;
  locOptions: { id: number; name: string }[];
  fetchLocs: (query: string) => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
  userRole: UserRole;
}

export function WizardStep2({
  formData,
  setFormData,
  locOptions,
  fetchLocs,
  handlePhotoUpload,
  onSubmit,
  onBack,
  userRole,
}: WizardStep2Props) {
  return (
    <div className="step-container">
      <h2>Step 2: Details</h2>
      {userRole === "admin" && (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={onBack} className="btn btn-secondary">
            Back to Step 1
          </button>
        </div>
      )}

      <div className="form-group">
        <label>Photo</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {formData.photo && (
          <Avatar
            src={formData.photo}
            alt="Preview"
            className="preview-image"
          />
        )}
      </div>

      <div className="form-group">
        <label>Employment Type</label>
        <select
          value={formData.employmentType}
          onChange={(e) =>
            setFormData({
              ...formData,
              employmentType: e.target.value as EmploymentType,
            })
          }
        >
          <option value="">Select Type</option>
          {EMPLOYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Office Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
            fetchLocs(e.target.value);
          }}
          list="loc-list"
        />
        <datalist id="loc-list">
          {locOptions.map((l) => (
            <option key={l.id} value={l.name} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="wizard-actions">
        <button onClick={onSubmit} className="btn btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
}
