import { useLoaderData, useSearchParams } from "react-router";
import type { Employee } from "~/types/employee";

export interface EmployeesLoaderData {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
}

export function useEmployees() {
  const { employees, total, page, limit } =
    useLoaderData<EmployeesLoaderData>();
  const [_searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("_page", newPage.toString());
      return prev;
    });
  };

  return {
    employees,
    total,
    page,
    limit,
    handlePageChange,
  };
}
