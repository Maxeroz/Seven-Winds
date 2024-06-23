import React, { Fragment } from "react";

function ActionLines({ lineHeight, fullLine, firstChild, id, isAdded }) {
  // Отрисовываем данные линии
  if (!isAdded)
    return (
      <Fragment key={id}>
        <div
          className={`absolute bottom-1/2 left-[-14px] z-0 ${firstChild ? "h-[55px]" : "h-[60px]"} w-px bg-pink-500`}
          style={
            firstChild ? { height: fullLine * 55 } : { height: fullLine * 55 }
          }
        ></div>
        <div className="absolute bottom-1/2 left-[-14px] z-0 h-px w-[21px] bg-pink-500"></div>
      </Fragment>
    );

  if (isAdded)
    return (
      <Fragment key={id}>
        <div
          className={`absolute bottom-1/2 left-[-14px] z-0 ${firstChild ? "h-[55px]" : "h-[60px]"} w-px bg-pink-500`}
          style={
            firstChild ? { height: fullLine * 50 } : { height: fullLine * 60 }
          }
        ></div>
        <div className="absolute bottom-1/2 left-[-14px] z-0 h-px w-[21px] bg-pink-500"></div>
      </Fragment>
    );
}

export default ActionLines;
