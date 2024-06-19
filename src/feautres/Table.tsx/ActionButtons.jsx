import React, { useState } from "react";

const ActionButtons = ({ onAdd, onDelete, level, id }) => {
  const [displayOn, setDisplayOn] = useState();

  const handleHover = () => {
    setDisplayOn(true);
  };

  const handleMouseLeave = () => {
    setDisplayOn(false);
  };

  return (
    <div className="relative">
      {/* Основной блок с кнопками */}
      <div
        className={`relative z-10 flex items-center justify-between rounded-md py-2 pl-[3px] pr-[7px] ${displayOn ? "w-[60px] bg-actionColor" : "w-[40px]"} transition-all duration-200`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Линии, которые рисуются под блоком */}
        {level === "child" && (
          <>
            <div
              className={`absolute bottom-1/2 left-[-14px] z-0 h-[52px] w-px bg-borderButton`}
            ></div>
            <div className="absolute bottom-1/2 left-[-14px] z-0 h-px w-[21px] bg-borderButton"></div>
          </>
        )}
        {/* Конец линий */}

        {/* Кнопка редактирования */}
        <button type="button" onClick={onAdd} onMouseEnter={handleHover}>
          <img src="./editButton.svg" alt="" />
        </button>

        {/* Кнопка удаления, отображается при наведении */}
        {displayOn && (
          <button type="button" onClick={onDelete}>
            <img src="./deleteButton.svg" alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
