import React, { useState } from "react";

const ActionButtons = ({
  onAdd,
  onDelete,
  level,
  id,
  onCurrentId,
  isEdited,
  firstChild,
}) => {
  const [displayOn, setDisplayOn] = useState();

  const handleHover = () => {
    setDisplayOn(true);
  };

  const handleMouseLeave = () => {
    setDisplayOn(false);
  };

  const handleAdd = () => {
    onAdd();
    onCurrentId(id);
  };

  return (
    <div className="relative">
      {/* Линии, которые рисуются под блоком */}
      {level === "child" && (
        <>
          <div
            className={`absolute bottom-1/2 left-[-14px] z-0 ${firstChild ? "h-[55px]" : "h-[60px]"} w-px bg-borderButton`}
          ></div>
          <div className="absolute bottom-1/2 left-[-14px] z-0 h-px w-[21px] bg-borderButton"></div>
        </>
      )}
      {/* Конец линий */}

      {/* Основной блок с кнопками */}
      <div
        className={`relative z-10 flex items-center justify-between rounded-md pl-[3px] transition-all duration-200 ${displayOn ? "w-[60px] bg-actionColor py-2 pr-[7px]" : "w-[40px]"}`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Кнопка редактирования */}

        <button
          type="button"
          onClick={handleAdd}
          onMouseEnter={handleHover}
          className="relative z-20"
          disabled={isEdited}
        >
          <img src="./editButton.svg" alt="" />
        </button>

        {/* Кнопка удаления, отображается при наведении */}
        {displayOn && (
          <button
            type="button"
            onClick={onDelete}
            className="relative z-20"
            disabled={isEdited}
          >
            <img src="./deleteButton.svg" alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
