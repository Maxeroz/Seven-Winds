export default function LowerNavbar() {
  return (
    <div className="flex border-b border-borderMain">
      <div className="flex min-w-[234px] justify-between border-r border-borderMain pr-[7px]">
        <div className="flex flex-col justify-center py-[8px] pl-5 text-navbarSecondary">
          <h1>Название проекта</h1>
          <span className="text-[10px]">Аббревиатура</span>
        </div>
        <img src="./arrowDown.svg" alt="" className="w-3" />
      </div>

      <div className="flex h-[55px] w-[312px] items-center justify-center border-r border-borderMain text-lg">
        Строительно-монтажные работы
      </div>
    </div>
  );
}
