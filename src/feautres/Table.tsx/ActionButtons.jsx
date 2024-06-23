import React, { useEffect, useMemo, useState } from "react";
import ActionIcons from "./ActionLines";
import ActionLines from "./ActionLines";

function findObjectsFromLevelById(data, parentId, targetId) {
  // Функция для рекурсивного поиска объекта по id
  function findObjectRecursive(obj, parentId, targetId) {
    // Если текущий объект совпадает по id с parentId, начинаем добавлять его дочерние элементы
    if (obj.id === parentId) {
      const result = [];
      // Рекурсивно добавляем дочерние элементы, пока не достигнем объекта с targetId
      for (const child of obj.child || []) {
        if (child.id === targetId) {
          return result; // Останавливаем добавление при достижении объекта с targetId
        }
        result.push(child);
        const nestedResult = findObjectRecursive(child, parentId, targetId);
        result.push(...nestedResult);
      }
      return result;
    }

    // Если у объекта есть children, рекурсивно ищем в них
    if (obj.child && obj.child.length > 0) {
      for (const child of obj.child) {
        const result = findObjectRecursive(child, parentId, targetId);
        if (result.length > 0) {
          return result; // Если найдены объекты до targetId, возвращаем результат
        }
      }
    }

    return []; // Если объект не найден или достигнут targetId
  }

  // Проверяем каждый элемент массива data
  for (const obj of data) {
    const result = findObjectRecursive(obj, parentId, targetId); // Начинаем с уровня 1
    if (result.length > 0) {
      return result;
    }
  }

  // Если объект с parentId не найден, возвращаем пустой массив
  return [];
}

function findParentId(root, targetId) {
  // Вспомогательная функция для рекурсивного поиска родителя
  function findParent(currentObj, parentId = null) {
    // Проверяем, если текущий объект имеет целевой ID, возвращаем ID родителя
    if (currentObj.id === targetId) {
      return parentId;
    }
    // Если есть дети, рекурсивно проходим по ним
    if (currentObj.child && currentObj.child.length > 0) {
      for (let child of currentObj.child) {
        let result = findParent(child, currentObj.id);
        if (result !== null) {
          return result;
        }
      }
    }
    return null; // Если ничего не найдено, возвращаем null
  }

  return findParent(root);
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
  array,
  firstChild,
  onAdd,
  onDelete,
  level,
  id,
  currentId,
  onCurrentId,
  isAdded,
  lineHeight,
}) => {
  const [displayOn, setDisplayOn] = useState(false);
  const [fullLine, setFullLine] = useState(null);
  const [computedParentId, setComputedParentId] = useState(null);
  const [newBetweenItemsArray, setNewBetweenItemsArray] = useState([]);

  // Calculate computedParentId and newBetweenItemsArray
  useEffect(() => {
    if (array && id) {
      // Находится родительский id
      const parentId = findParentId({ child: array }, id);
      setComputedParentId(parentId);
      // Находится массив объектом между родительским объектом и текущим объектом ряда
      const betweenItemsArray = findObjectsFromLevelById(array, parentId, id);
      setNewBetweenItemsArray(betweenItemsArray);
    }
  }, [array, id]);

  const handleDelete = () => {
    setFullLine(null);
    onDelete();
  };

  // Устанавливаем полную длину на количество элементов между родительским объектом
  // и текущим объектом ряда и прибавляем 1
  useEffect(() => {
    let newFullLine = countElements(newBetweenItemsArray) + 1;

    setFullLine(newFullLine);
  }, [newBetweenItemsArray]);

  const handleHover = () => {
    setDisplayOn(true);
  };

  const handleMouseLeave = () => {
    setDisplayOn(false);
  };

  const handleAdd = () => {
    // RESET STATE

    if (currentId === id) return;
    onAdd(id);

    onCurrentId(id);
  };

  if (isAdded) {
    return (
      <div className="relative" key={id}>
        {/* Линии, которые рисуются под блоком */}
        {level === "child" && (
          <ActionLines
            lineHeight={lineHeight}
            firstChild={firstChild}
            id={`${id}-${lineHeight}`}
            isAdded={isAdded}
          />
        )}
        {/* Конец линий */}

        {/* Основной блок с кнопками. Отображаем его когда isAdded true*/}
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
            disabled={currentId && currentId !== id}
          >
            <img src="./editButton.svg" alt="" />
          </button>

          {/* Кнопка удаления, отображается при наведении */}
          {displayOn && (
            <button
              type="button"
              onClick={handleDelete}
              className="relative z-20"
              disabled={currentId && currentId !== id}
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
          <ActionLines
            fullLine={fullLine}
            firstChild={firstChild}
            key={`${id}-${lineHeight}`}
          />
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
            disabled={currentId && currentId !== id}
          >
            <img src="./editButton.svg" alt="" />
          </button>

          {/* Кнопка удаления, отображается при наведении */}
          {displayOn && (
            <button
              type="button"
              onClick={handleDelete}
              className="relative z-20"
              disabled={currentId && currentId !== id}
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
