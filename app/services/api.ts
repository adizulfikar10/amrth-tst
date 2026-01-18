import type { BasicInfo, DetailInfo, Employee } from "~/types/employee";

const BASIC_INFO_API = "http://localhost:4001";
const DETAILS_API = "http://localhost:4002";

interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export async function getEmployees(
  page: number = 1,
  limit: number = 5
): Promise<{ employees: Employee[]; total: number }> {
  const [basicRes, detailsRes] = await Promise.all([
    fetch(`${BASIC_INFO_API}/basicInfo?_page=${page}&_per_page=${limit}`),
    fetch(`${DETAILS_API}/details?_page=${page}&_per_page=${limit}`),
  ]);

  if (!basicRes.ok || !detailsRes.ok) {
    throw new Error("Failed to fetch employees");
  }

  const basicJson: PaginatedResponse<BasicInfo> = await basicRes.json();
  const detailsJson: PaginatedResponse<DetailInfo> = await detailsRes.json();

  const basicData = basicJson.data || [];
  const detailsData = detailsJson.data || [];

  const basicTotal = basicJson.items || 0;
  const detailsTotal = detailsJson.items || 0;
  const total = Math.max(basicTotal, detailsTotal);

  const merged = new Map<string, Employee>();

  // Add Basic Info
  basicData.forEach((item) => {
    const key = item.employeeId || item.id;
    merged.set(key, { ...item, employeeId: key });
  });

  // Merge Details
  detailsData.forEach((item) => {
    const key = item.employeeId;
    if (merged.has(key)) {
      merged.set(key, { ...merged.get(key)!, ...item });
    } else {
      merged.set(key, { ...item, employeeId: key });
    }
  });

  return {
    employees: Array.from(merged.values()),
    total,
  };
}
