import MainTable from "./MainTable";
import Rows from "./Rows";
import TreeList from "./TreeList";

export default function Table() {
  return (
    <div className="flex flex-1 flex-col pl-5">
      <MainTable />
      <Rows />
    </div>
  );
}
