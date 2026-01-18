import type { MetaFunction } from "react-router";
import { HomeView } from "~/views/HomeView";

export const meta: MetaFunction = () => {
  return [
    { title: "Employee Management" },
    { name: "description", content: "Welcome to Employee Management System" },
  ];
};

export default function Home() {
  return <HomeView />;
}
