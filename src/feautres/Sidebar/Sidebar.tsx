import SidebarClause from "./SidebarClause";

export default function Sidebar() {
  const data = [
    {
      id: 1,
      title: "По проекту",
    },
    {
      id: 2,
      title: "Объекты",
    },
    {
      id: 3,
      title: "РД",
    },
    {
      id: 4,
      title: "МТО",
    },
    {
      id: 5,
      title: "СМР",
    },
    {
      id: 6,
      title: "График",
    },
    {
      id: 7,
      title: "МиМ",
    },
    {
      id: 8,
      title: "Рабочие",
    },
    {
      id: 9,
      title: "Капвложения",
    },
    {
      id: 10,
      title: "Бюджет",
    },
    {
      id: 11,
      title: "Финансирование",
    },
    {
      id: 12,
      title: "Панорамы",
    },
    {
      id: 13,
      title: "Капвложения",
    },
    {
      id: 14,
      title: "Камеры",
    },
    {
      id: 15,
      title: "Поручения",
    },
    {
      id: 16,
      title: "Контрагенты",
    },
  ];

  return (
    <div className="min-w-[234px] border-r border-borderMain">
      <ul>
        {data.map((item) => (
          <SidebarClause key={item.id} title={item.title} />
        ))}
      </ul>
    </div>
  );
}
