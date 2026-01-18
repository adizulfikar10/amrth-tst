import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDebounce } from "~/hooks/useDebounce";
import {
  getDepartments,
  getLocations,
  getBasicInfoByDepartment,
  createBasicInfo,
  createDetailInfo,
} from "~/services/api";
import type {
  UserRole,
  WizardData,
} from "~/types/wizard";

export const INITIAL_DATA: WizardData = {
  fullName: "",
  email: "",
  department: "",
  jobRole: "",
  employeeId: "",
  photo: "",
  employmentType: "",
  location: "",
  notes: "",
};

export function useWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = searchParams.get("role");
  const [userRole, setUserRole] = useState<UserRole>(
    roleParam === "ops" || roleParam === "admin" ? roleParam : "admin"
  );

  useEffect(() => {
    if (userRole) {
      setSearchParams({ role: userRole }, { replace: true });
    }
  }, [userRole, setSearchParams]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const [deptOptions, setDeptOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [locOptions, setLocOptions] = useState<{ id: number; name: string }[]>(
    []
  );

  const draftKey = `draft_${userRole}`;
  const debouncedData = useDebounce(formData, 2000);

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [draftKey]);

  // Auto-save
  useEffect(() => {
    if (JSON.stringify(debouncedData) !== JSON.stringify(INITIAL_DATA)) {
      localStorage.setItem(draftKey, JSON.stringify(debouncedData));
    }
  }, [debouncedData, draftKey]);

  useEffect(() => {
    if (userRole === "ops") {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [userRole]);

  const fetchDepts = async (query: string) => {
    if (!query) return;
    try {
      const data = await getDepartments(query);
      setDeptOptions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLocs = async (query: string) => {
    if (!query) return;
    try {
      const data = await getLocations(query);
      setLocOptions(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Generate Employee ID
  const generateEmployeeId = async (deptName: string) => {
    if (!deptName) return;
    const prefix = deptName.substring(0, 3).toUpperCase();

    try {
      const existing = await getBasicInfoByDepartment(deptName);

      let maxSeq = 0;
      if (Array.isArray(existing)) {
        existing.forEach((emp: any) => {
          if (emp.employeeId && emp.employeeId.startsWith(prefix + "-")) {
            const parts = emp.employeeId.split("-");
            if (parts.length === 2) {
              const seq = parseInt(parts[1], 10);
              if (!isNaN(seq) && seq > maxSeq) {
                maxSeq = seq;
              }
            }
          }
        });
      }

      const seq = (maxSeq + 1).toString().padStart(3, "0");
      const newId = `${prefix}-${seq}`;
      setFormData((prev) => ({ ...prev, employeeId: newId }));
    } catch (e) {
      console.error("Failed to generate ID", e);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setFormData(INITIAL_DATA);
  };

  const validateStep1 = () => {
    return Boolean(
      formData.fullName &&
      formData.email &&
      formData.email.includes("@") &&
      formData.department &&
      formData.jobRole &&
      formData.employeeId
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProgress(0);
    setLogs([]);

    try {
      if (userRole === "admin" || formData.fullName) {
        setLogs((prev) => [...prev, "⏳ Submitting basicInfo..."]);
        setProgress(20);

        await new Promise((r) => setTimeout(r, 3000)); // Delay 3s

        const basicPayload = {
          fullName: formData.fullName,
          email: formData.email,
          department: formData.department,
          role: formData.jobRole,
          employeeId: formData.employeeId || `UNK-${Date.now()}`,
          id: formData.employeeId || `UNK-${Date.now()}`,
        };

        await createBasicInfo(basicPayload);

        setLogs((prev) => [...prev, "✅ basicInfo saved!"]);
        setProgress(50);
      } else {
        setLogs((prev) => [
          ...prev,
          "ℹ️ Skipping basicInfo (Ops mode or empty)...",
        ]);
        setProgress(50);
      }

      setLogs((prev) => [...prev, "⏳ Submitting details..."]);
      setProgress(70);

      await new Promise((r) => setTimeout(r, 3000)); // Delay 3s

      const detailsPayload = {
        employeeId: formData.employeeId || `UNK-${Date.now()}`, // Link key
        photo: formData.photo,
        employmentType: formData.employmentType,
        location: formData.location,
        notes: formData.notes,
      };

      await createDetailInfo(detailsPayload);

      setLogs((prev) => [...prev, "✅ details saved!"]);
      setProgress(90);

      setLogs((prev) => [...prev, "🎉 All data processed successfully!"]);
      setProgress(100);

      // Redirect
      setTimeout(() => {
        localStorage.removeItem(draftKey);
        navigate("/employees");
      }, 1000);
    } catch (e: any) {
      console.error(e);
      setLogs((prev) => [...prev, `❌ Error: ${e.message}`]);
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
