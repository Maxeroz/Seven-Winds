import { useState } from "react";

import { LinkNavbarProps } from "../types/types";

type ActiveType = boolean;

export default function LinkNavbar({ title, id, active }: LinkNavbarProps) {
  return (
    <button className={`${id === active && "border-b-2 text-white"} py-[10px]`}>
      {title}
    </button>
  );
}
