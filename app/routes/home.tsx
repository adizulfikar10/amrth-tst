import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Employee Management" },
    { name: "description", content: "Welcome to Employee Management System" },
  ];
};

export default function Home() {
  return (
    <div className="container">
      <h1>Employee Management System</h1>
    </div>
  );
}
