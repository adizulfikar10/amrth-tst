import { Link } from "react-router";
import { ProgressBar } from "~/components/ProgressBar";
import { WizardStep1 } from "~/components/WizardStep1";
import { WizardStep2 } from "~/components/WizardStep2";
import { useWizard } from "~/hooks/useWizard";
import type { UserRole } from "~/types/wizard";

export function WizardView() {
  const {
    userRole,
    setUserRole,
    step,
    setStep,
    formData,
    setFormData,
    isSubmitting,
    progress,
    logs,
    deptOptions,
    locOptions,
    fetchDepts,
    fetchLocs,
    generateEmployeeId,
    handlePhotoUpload,
    clearDraft,
    validateStep1,
    handleSubmit,
  } = useWizard();

  return (
    <div className="container">
      <header className="page-header">
        <h1>Employee Wizard</h1>
        <Link to="/employees" style={{ textDecoration: "none" }}>
          <button className="btn btn-secondary">Back to List</button>
        </Link>
      </header>

      {/* Role Selection */}
      <div className="wizard-role-selector">
        <label>Current Role: </label>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as UserRole)}
          disabled={isSubmitting}
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
          }}
        >
          <option value="admin">Admin</option>
          <option value="ops">Ops</option>
        </select>
        <button
          onClick={clearDraft}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Clear Draft
        </button>
      </div>

      {isSubmitting ? (
        <ProgressBar progress={progress} logs={logs} />
      ) : (
        <>
          {/* Step 1: Basic Info (Admin Only) */}
          {userRole === "admin" && step === 1 && (
            <WizardStep1
              formData={formData}
              setFormData={setFormData}
              deptOptions={deptOptions}
              fetchDepts={fetchDepts}
              generateEmployeeId={generateEmployeeId}
              onNext={() => setStep(2)}
              isValid={validateStep1()}
            />
          )}

          {/* Step 2: Details (Admin + Ops) */}
          {step === 2 && (
            <WizardStep2
              formData={formData}
              setFormData={setFormData}
              locOptions={locOptions}
              fetchLocs={fetchLocs}
              handlePhotoUpload={handlePhotoUpload}
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
              userRole={userRole}
            />
          )}
        </>
      )}
    </div>
  );
}
