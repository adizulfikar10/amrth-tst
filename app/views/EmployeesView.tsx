import { Link } from "react-router";
import { Avatar } from "~/components/Avatar";
import { Badge } from "~/components/Badge";
import { Pagination } from "~/components/Pagination";
import type { Employee } from "~/types/employee";

interface EmployeesViewProps {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export function EmployeesView({
  employees,
  total,
  page,
  limit,
  onPageChange,
}: EmployeesViewProps) {
  const totalPages = Math.ceil(total / limit);

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
                    <Badge variant={emp.role}>{emp.role}</Badge>
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
        onPageChange={onPageChange}
      />
    </div>
  );
}
