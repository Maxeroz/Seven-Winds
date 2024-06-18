import Sidebar from "../Sidebar/Sidebar";
import Table from "../Table.tsx/Table";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <Sidebar />
      <Table />
    </div>
  );
}
