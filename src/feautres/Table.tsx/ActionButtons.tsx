import React, { useState } from "react";

interface ActionButtonsProps {
  onAdd: () => void;
  onDelete?: () => void;

  level: number;
  id: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdd,
  onDelete,
  level,
  id,
}) => {
  const [displayOn, setDisplayOn] = useState<boolean>(false);
  const handleHover = () => {
    // setDisplayOn(true);
  };

  const handleMouseLeave = () => {
    // setDisplayOn(false);
  };

  return (
    <>
      <div
        className={`bg-actionColor p= relative z-10 flex items-center justify-around rounded-md ${displayOn ? "w-[55px]" : "w-[24px]"} transition-all duration-200`}
        onMouseLeave={handleMouseLeave}
      >
        {/* DIVs to paint lines */}
        {level > 0 ? (
          <>
            <div
              className={`bg-borderButton absolute bottom-1/2 left-[-14px] z-0 h-12 w-px`}
            ></div>
            <div
              className={`bg-borderButton absolute bottom-1/2 left-[-14px] z-0 h-px w-[14px]`}
            ></div>
          </>
        ) : null}
        {/* DIVs to paint lines */}
        <button onClick={onAdd} onMouseEnter={handleHover}>
          <img src="./editButton.svg" alt="" />
        </button>
        {displayOn && (
          <button onClick={onDelete}>
            <img src="./deleteButton.svg" alt="" />
          </button>
        )}
      </div>
    </>
  );
};

export default ActionButtons;
