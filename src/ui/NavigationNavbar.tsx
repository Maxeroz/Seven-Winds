import { useState } from "react";

import LinkNavbar from "./LinkNavbar";

export default function NavigationNavbar() {
  const [active, setActive] = useState(1);

  const data = [
    {
      id: 1,
      title: "Просмотр",
    },
    {
      id: 2,
      title: "Управление",
    },
  ];

  return (
    <div>
      <ul className="flex gap-[28px]">
        {data.map((item) => (
          <LinkNavbar
            key={item.id}
            title={item.title}
            active={active}
            id={item.id}
          />
        ))}
      </ul>
    </div>
  );
}
