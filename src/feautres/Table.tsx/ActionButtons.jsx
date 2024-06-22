import React, { useEffect, useState } from "react";

function findObjectsFromLevelById(data, targetId) {
  // Функция для рекурсивного поиска объекта по id
  function findObjectRecursive(obj, id, currentLevel) {
    // Если текущий объект совпадает по id, возвращаем текущий уровень и дальнейшие объекты
    if (obj.id === id) {
      return [obj];
    }

    // Если у объекта есть children, рекурсивно ищем в них
    if (obj.child && obj.child.length > 0) {
      for (const child of obj.child) {
        const result = findObjectRecursive(child, id, currentLevel + 1);
        if (result) {
          // Если объект найден в дочерних элементах, возвращаем результат
          return [...result];
        }
      }
    }

    return null; // Если объект не найден
  }

  // Проверяем каждый элемент массива data
  for (const obj of data) {
    const result = findObjectRecursive(obj, targetId, 1); // Начинаем с уровня 1
    if (result) {
      return result;
    }
  }

  // Если объект с заданным id не найден, возвращаем пустой массив
  return [];
}

// Рекурсивная функция для поиска объекта по id в массиве с бесконечной вложенностью.
const findObjectById = (array, id, childKey = "child") => {
  for (const item of array) {
    if (item.id === id) {
      return item;
    }
    if (item[childKey]) {
      const result = findObjectById(item[childKey], id, childKey);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

// Функция для того чтобы посчитать длину вертикальной линии относительно количество элементов в своействе объекта child
function countElements(arr) {
  let count = 0;

  function recursiveCount(objArray) {
    for (const obj of objArray) {
      count++;
      if (obj.child && Array.isArray(obj.child)) {
        recursiveCount(obj.child);
      }
    }
  }

  recursiveCount(arr);
  return count;
}

const ActionButtons = ({
  onAdd,
  onDelete,
  level,
  id,
  onCurrentId,
  isEdited,
  firstChild,
  array,
  onCurrentObj,
  isAdded,
  lineHeight,
  currentId,
}) => {
  const [displayOn, setDisplayOn] = useState();
  const [fullLine, setFullLine] = useState(null);
  const [currentArray, setCurrentArray] = useState([]);
  // Array состояние рядов приложения
  const isArrayEmpty = array.length === 0;

  // useEffect(() => {
  //   if (array) {
  //     setFullLine(countElements(findObjectsFromLevelById(array, id)));
  //   }
  //   if (array) setCurrentArray(findObjectsFromLevelById(array, id));
  // }, [currentId]);

  const handleHover = () => {
    setDisplayOn(true);
  };

  const handleMouseLeave = () => {
    setDisplayOn(false);
  };

  const handleAdd = () => {
    if (currentId === id) return;
    onAdd();
    onCurrentId(id);

    onCurrentObj(findObjectById(array, id));
  };

  if (isAdded) {
    // const fullLine = lineHeight * 55;

    return (
      <div className="relative">
        {/* Линии, которые рисуются под блоком */}
        {level === "child" && (
          <>
            <div
              className={`absolute bottom-1/2 left-[-14px] z-0 ${firstChild ? "h-[55px]" : "h-[60px]"} w-px bg-borderButton`}
              style={{ height: lineHeight * 55 }}
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
            disabled={!id}
          >
            <img src="./editButton.svg" alt="" />
          </button>

          {/* Кнопка удаления, отображается при наведении */}
          {displayOn && (
            <button
              type="button"
              onClick={onDelete}
              className="relative z-20"
              disabled={isAdded}
            >
              <img src="./deleteButton.svg" alt="" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!isAdded) {
    return (
      <div className="relative">
        {/* Линии, которые рисуются под блоком */}
        {level === "child" && (
          <>
            <div
              className={`absolute bottom-1/2 left-[-14px] z-0 ${firstChild ? "h-[55px]" : "h-[60px]"} w-px bg-borderButton`}
              // style={{ height: fullLine * 55 }}
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
            disabled={isEdited || isArrayEmpty || isAdded}
          >
            <img src="./editButton.svg" alt="" />
          </button>

          {/* Кнопка удаления, отображается при наведении */}
          {displayOn && (
            <button
              type="button"
              onClick={onDelete}
              className="relative z-20"
              disabled={isEdited || isArrayEmpty || isAdded}
            >
              <img src="./deleteButton.svg" alt="" />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default ActionButtons;
