import { Link, useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/employees";
import { getEmployees } from "~/services/api";
import { Pagination } from "~/components/Pagination";
import { Avatar } from "~/components/Avatar";

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

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("_page", newPage.toString());
      return prev;
    });
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>Employee List</h1>
        <Link to="/wizard" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary">+ Add Employee</button>
        </Link>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>
                  <Avatar src={emp.photo} alt={emp.fullName} />
                </td>
                <td>{emp.fullName || "—"}</td>
                <td>{emp.department || "—"}</td>
                <td>
                  {emp.role ? (
                    <span
                      className={`badge ${
                        emp.role.toLowerCase() === "admin"
                          ? "badge-admin"
                          : emp.role.toLowerCase() === "ops"
                            ? "badge-ops"
                            : ""
                      }`}
                    >
                      {emp.role}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{emp.location || "—"}</td>
                <td>
                  <span style={{ fontSize: "0.8em", color: "#666" }}>
                    {emp.employeeId}
                  </span>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#666" }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
