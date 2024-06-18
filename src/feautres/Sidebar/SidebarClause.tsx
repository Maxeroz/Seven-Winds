import { SidebarClauseProps } from "../../types/types";

export default function SidebarClause({ title }: SidebarClauseProps) {
  return (
    <div className="flex gap-[14px] py-[8px] pl-5">
      <img src="./clauseIcon.svg" alt="" />
      <p>{title}</p>
    </div>
  );
}
