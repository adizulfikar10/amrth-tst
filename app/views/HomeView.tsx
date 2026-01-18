import { Link } from "react-router";

export function HomeView() {
  return (
    <div className="container">
      <h1>Employee Management System</h1>
      <p>Select an action below:</p>
      <nav>
        <ul>
          <li>
            <Link to="/wizard">New Employee Wizard (Admin & Ops)</Link>
          </li>
          <li>
            <Link to="/employees">Employee List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
