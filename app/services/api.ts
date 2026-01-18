import type { BasicInfo, DetailInfo, Employee } from "~/types/employee";

const BASIC_INFO_API_URL =
  (typeof process !== "undefined"
    ? process.env.BASIC_INFO_API_URL
    : undefined) || import.meta.env?.BASIC_INFO_API_URL;
const DETAILS_API_URL =
  (typeof process !== "undefined" ? process.env.DETAILS_API_URL : undefined) ||
  import.meta.env?.DETAILS_API_URL;

const BASIC_INFO_API =
  BASIC_INFO_API_URL ||
  "http://localhost:4001";
const DETAILS_API =
  DETAILS_API_URL ||
  "http://localhost:4002";


export async function getEmployees(
  page: number = 1,
  limit: number = 5
): Promise<{ employees: Employee[]; total: number }> {
  const [basicRes, detailsRes] = await Promise.all([
    fetch(`${BASIC_INFO_API}/basicInfo?_page=${page}&_limit=${limit}`),
    fetch(`${DETAILS_API}/details?_page=${page}&_limit=${limit}`),
  ]);


  if (!basicRes.ok || !detailsRes.ok) {
    throw new Error("Failed to fetch employees");
  }

  const basicData: BasicInfo[] = await basicRes.json();
  const detailsData: DetailInfo[] = await detailsRes.json();

  const basicTotal = parseInt(basicRes.headers.get("X-Total-Count") || "0", 10);
  const detailsTotal = parseInt(detailsRes.headers.get("X-Total-Count") || "0", 10);
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

export async function getDepartments(query: string) {
  const res = await fetch(`${BASIC_INFO_API}/departments?name_like=${query}`);
  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
}

export async function getLocations(query: string) {
  const res = await fetch(`${DETAILS_API}/locations?name_like=${query}`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function getBasicInfoByDepartment(deptName: string) {
  const res = await fetch(
    `${BASIC_INFO_API}/basicInfo?department=${encodeURIComponent(deptName)}`
  );
  if (!res.ok) throw new Error("Failed to fetch basic info by department");
  return res.json();
}

export async function createBasicInfo(data: Partial<BasicInfo>) {
  const res = await fetch(`${BASIC_INFO_API}/basicInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save basic info");
  return res.json();
}

export async function createDetailInfo(data: Partial<DetailInfo>) {
  const res = await fetch(`${DETAILS_API}/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save details");
  return res.json();
}
