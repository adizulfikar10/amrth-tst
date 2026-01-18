import { useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/employees";
import { getEmployees } from "~/services/api";
import { EmployeesView } from "~/views/EmployeesView";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("_page")) || 1;
  const limit = Number(url.searchParams.get("_limit")) || 5;

  const { employees, total } = await getEmployees(page, limit);

  return { employees, total, page, limit };
}

export default function Employees() {
  const { employees, total, page, limit } = useLoaderData<typeof loader>();
  const [_searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("_page", newPage.toString());
      return prev;
    });
  };

  return (
    <EmployeesView
      employees={employees}
      total={total}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
    />
  );
}
