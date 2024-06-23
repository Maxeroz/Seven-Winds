import { Fragment, useEffect, useRef, useState } from "react";
import { API_ID, API_URL } from "../../config";
import ActionButtons from "./ActionButtons";
import { createRowMarkup } from "../../utils/createRowMarkUp.jsx";
import InputRow from "./InputRow.jsx";
// import ActionButtons from "./ActionButtons";

// Главный компонент таблицы
const EditableTable = () => {
  // Состояния компонента
  const [initialData, setInitialData] = useState(null);
  const [currentArray, setCurrentArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [currentObj, setCurrentObj] = useState({});
  const [lineHeight, setLineHeight] = useState(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    id: 0,
    rowName: "",
    salary: 0,
    equipmentCosts: 0,
    overheads: 0,
    estimatedProfit: 0,
    level: 0,
    parentId: undefined,
    child: [],
  });

  const nestRef = useRef(1);

  let initialLevel = 0;

  useEffect(() => {
    if (initialData) {
      //Objs = объект найденный по ID, который имеет полную вложенность со свойством child
      const objs = findObjectsFromLevelById(initialData, currentId);

      // Функция для подсчета всех объектов начиная от родителя и проходя по свойству child
      const amountObjs = countElements(objs);

      // Устанавливаем количество объектов на lineHeight для того чтобы передать эту высоту в пропс кнопки
      // и отрисовать правильную длину линии. Вычитаем 1 для того чтобы не учитывать родительский объект
      setLineHeight(amountObjs - 1);
    }
  }, [currentId, initialData]);

  function findObjectAndInsert(data, parentId, targetId) {
    // Рекурсивная функция для поиска объекта по id
    function findObjectRecursive(objArray, parentId, targetId) {
      for (let i = 0; i < objArray.length; i++) {
        const obj = objArray[i];
        if (obj.id === parentId) {
          // Найден объект с заданным parentId, добавляем новый объект после всех объектов текущего уровня
          if (targetId !== undefined) {
            // Добавляем новый объект с id: 12345 в конец текущего уровня
            objArray.push({ id: 12345 });
          }
          return true; // Возвращаем true, чтобы прекратить дальнейший поиск
        }
        // Рекурсивно ищем в дочерних элементах, если они есть
        if (obj.child && obj.child.length > 0) {
          if (findObjectRecursive(obj.child, parentId, targetId)) {
            return true; // Возвращаем true, чтобы прекратить дальнейший поиск
          }
        }
      }
      return false; // Объект с заданным id не найден
    }

    // Ищем объект по id в массиве data
    findObjectRecursive(data, parentId, targetId);

    return data; // Возвращаем измененный массив
  }

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

  const getLevel = (rows, level = 1) => {
    return rows.map((item) => {
      const newItem = { ...item, level };

      if (item.child) {
        newItem.child = getLevel(item.child, level + 1);
      }

      return newItem;
    });
  };

  const handleInsert = (initialData, parentId, targetId) => {
    setInitialData(findObjectAndInsert(initialData, parentId, targetId));
  };

  const handleAdd = (id) => {
    // setCurrentId(id);

    setIsAdded(true);
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

  const handleDelete = async (array, id) => {
    const modified = removeObjectByIdRecursive(array, id);

    fetch(`${API_URL}/v1/outlay-rows/entity/${API_ID}/row/${id}/delete`, {
      method: "DELETE",
    });

    setLineHeight(0);
    setInitialData(modified);
    setCurrentArray(modified);
  };

  const removeObjectByIdRecursive = (array, id) => {
    return array
      .map((item) => {
        // Если у элемента есть дочерние элементы, применяем рекурсию к ним
        if (item.child) {
          return {
            ...item,
            child: removeObjectByIdRecursive(item.child, id),
          };
        }
        return item;
      })
      .filter((item) => item.id !== id); // Удаляем элемент только на текущем уровне
  };

  // FETCH ON MOUNT _________________________________________________________
  useEffect(() => {
    const fetchData = async function (url, id) {
      setIsLoading(true);

      try {
        const res = await fetch(`${url}/v1/outlay-rows/entity/${id}/row/list`);

        setIsLoading(false);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setInitialData(getLevel(data));
        setCurrentArray(data);

        return data;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchData(API_URL, API_ID);
  }, []);

  // Функция для обновления вложенных элементов
  const updateNestedRow = (data, id, updatedRowObj) => {
    return data.map((item) => {
      if (item.id === id) {
        // Обновляем элемент, если id совпадает
        return { ...item, ...updatedRowObj };
      }
      // Проверяем наличие вложенных элементов
      if (item.child && item.child.length > 0) {
        return {
          ...item,
          child: updateNestedRow(item.child, id, updatedRowObj),
        };
      }
      return item;
    });
  };

  // Функция для добавления вложенных элементов
  const addChildToNestedItem = (items, currentId, data) => {
    return items.map((item) => {
      if (item.id === currentId) {
        // Добавляем новые данные в массив child найденного элемента
        return { ...item, child: [...(item.child || []), data.current] };
      } else if (item.child && item.child.length > 0) {
        // Рекурсивно ищем и обновляем вложенные массивы child
        return {
          ...item,
          child: addChildToNestedItem(item.child, currentId, data),
        };
      } else {
        return item;
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "rowName" ? value : parseFloat(value),
    });
  };

  const createRow = async function () {
    // Создаем объект newRow с данными из formData и некоторыми предустановленными значениями.
    const newRow = {
      equipmentCosts: formData.equipmentCosts,
      estimatedProfit: formData.estimatedProfit,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: formData.overheads,
      parentId: currentId || null,
      rowName: formData.rowName,
      salary: formData.salary,
      supportCosts: 0,
    };

    // Если строка не редактируется, выполняем создание новой строки.
    if (!isEdited) {
      try {
        const res = await fetch(
          `${API_URL}/v1/outlay-rows/entity/${API_ID}/row/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newRow),
          },
        );

        if (!res.ok) {
          throw new Error("Failed to create row");
        }

        const data = await res.json();

        if (initialData.length === 0) {
          setInitialData((currentRows) => [
            ...currentRows,
            { ...data.current, child: [] },
          ]);
        }

        setInitialData((items) => {
          const result = getLevel(addChildToNestedItem(items, currentId, data));
          console.log(result);
          return result;
        });

        setIsAdded(false);
      } catch (error) {
        console.error("Error creating row:", error);
      }

      setFormData({
        id: 0,
        rowName: "",
        salary: 0,
        equipmentCosts: 0,
        overheads: 0,
        estimatedProfit: 0,
        level: 0,
        parentId: undefined,
        child: [],
      });

      setCurrentObj({});
      setLineHeight(0);
      setCurrentId(null);
      if (!isAdded) setIsAdded(true);
    }

    // Обновление ряда начинается здесь.
    // Если строка редактируется производим редактирование строки методом POST
    if (isEdited) {
      // Создаем обновленный объект с предзаполненными некоторыми свойствами.
      const {
        rowName,
        salary,
        equipmentCosts,
        estimatedProfit,
        overheads,
        id,
      } = formData;
      const updatedRowObj = {
        equipmentCosts,
        estimatedProfit,
        machineOperatorSalary: 0,
        mainCosts: 0,
        materials: 0,
        mimExploitation: 0,
        overheads,
        rowName,
        salary,
        supportCosts: 0,
      };

      try {
        const res = await fetch(
          `${API_URL}/v1/outlay-rows/entity/${API_ID}/row/${id}/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRowObj),
          },
        );

        const updatedInitialStateArray = updateNestedRow(
          initialData,
          id,
          updatedRowObj,
        );
        console.log(updatedInitialStateArray);

        setInitialData(updatedInitialStateArray);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsEdited(false);

        setFormData({
          id: 0,
          rowName: "",
          salary: 0,
          equipmentCosts: 0,
          overheads: 0,
          estimatedProfit: 0,
          level: 0,
          parentId: undefined,
          child: [],
        });

        setCurrentObj({});
        setIsAdded(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createRow();
  };

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

  const handleDoubleClick = (rowId) => {
    setIsEdited(true);
    setIsAdded(false);

    setCurrentId(rowId);

    // Деструктурировать текущий редактируемый объект для того чтобы установить текущее состояние инпутов в formData
    const {
      id,
      rowName,
      salary,
      equipmentCosts,
      overheads,
      estimatedProfit,
      level,
      parentId,
      child,
    } = findObjectById(initialData, rowId);

    setFormData({
      id,
      rowName,
      salary,
      equipmentCosts,
      overheads,
      estimatedProfit,
      level,
      parentId,
      child,
    });
    // alert("Double Clicked");
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="w-full text-sm">
        <thead>
          <tr className="h-[60px]">
            <th className="h-[42px] w-[110px] text-left font-normal">
              Уровень
            </th>
            <th className="h-[42px] w-[500px] text-left font-normal">
              Наименование работ
            </th>
            <th className="h-[42px] w-[140px] text-left font-normal">
              Основная з/п
            </th>
            <th className="h-[42px] w-[140px] text-left font-normal">
              Оборудование
            </th>
            <th className="h-[42px] w-[120px] text-left font-normal">
              Накладные расходы
            </th>
            <th className="h-[42px] text-left font-normal">Сметная прибыль</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="h-[60px] w-full text-green-500">
              <th className="text-left">Loading...</th>
            </tr>
          )}
          {error && (
            <tr className="h-[60px] w-full text-red-500">
              <th className="text-left">Error fetching data...</th>
            </tr>
          )}
          {initialData?.length > 0 &&
            initialData.map((row, i) => {
              return (
                <Fragment key={row.id}>
                  {/* Основной ряд таблицы */}
                  <div>Ряд верхний</div>
                  <tr
                    className={`h-[60px] border-y border-borderMain bg-orange-400 text-white ${isEdited ? "" : "cursor-pointer"}`}
                    onDoubleClick={() => handleDoubleClick(row.id)}
                  >
                    <td>
                      <ActionButtons
                        onDelete={() => handleDelete(initialData, row.id)}
                        onAdd={handleAdd}
                        id={row.id}
                        onCurrentId={setCurrentId}
                        isEdited={isEdited}
                        isAdded={isAdded}
                        array={initialData}
                        firstChild={true}
                        onCurrentObj={setCurrentObj}
                        lineHeight={lineHeight}
                        currentId={currentId}
                        handleInsert={handleInsert}
                      />
                    </td>
                    {/* Имя строки или инпут для редактирования */}
                    <td className="w-[500px]">
                      {isEdited && currentId === row.id ? (
                        <input
                          type="text"
                          name="rowName"
                          defaultValue={row.rowName}
                          className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] outline-none"
                          onChange={handleChange}
                        />
                      ) : (
                        row.rowName
                      )}
                    </td>
                    {/* Зарплата или инпут для редактирования */}
                    <td className="w-[140px]">
                      {isEdited && currentId === row.id ? (
                        <input
                          type="number"
                          name="salary"
                          defaultValue={row.salary}
                          className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                          onChange={handleChange}
                        />
                      ) : (
                        row.salary
                      )}
                    </td>
                    {/* Расходы на оборудование или инпут для редактирования */}
                    <td className="w-[120px]">
                      {isEdited && currentId === row.id ? (
                        <input
                          type="number"
                          name="equipmentCosts"
                          defaultValue={row.equipmentCosts}
                          className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                          onChange={handleChange}
                        />
                      ) : (
                        row.equipmentCosts
                      )}
                    </td>
                    {/* Накладные расходы или инпут для редактирования */}
                    <td className="w-[120px]">
                      {isEdited && currentId === row.id ? (
                        <input
                          type="number"
                          name="overheads"
                          defaultValue={row.overheads}
                          className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                          onChange={handleChange}
                        />
                      ) : (
                        row.overheads
                      )}
                    </td>
                    {/* Ожидаемая прибыль или инпут для редактирования */}
                    <td className="w-[120px]">
                      {isEdited && currentId === row.id ? (
                        <input
                          type="number"
                          name="estimatedProfit"
                          defaultValue={row.estimatedProfit}
                          className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                          onChange={handleChange}
                        />
                      ) : (
                        row.estimatedProfit
                      )}
                    </td>
                  </tr>
                  {/* Рекурсия для отображения вложенных рядов */}
                  {createRowMarkup(
                    row,
                    handleAdd,
                    handleDelete,
                    initialData,
                    setCurrentId,
                    nestRef.current,
                    handleDoubleClick,
                    isEdited,
                    isAdded,
                    currentId,
                    handleChange,
                    setCurrentObj,
                    lineHeight,
                    formData,
                    handleInsert,
                  )}
                </Fragment>
              );
            })}

          {/* Отобразить инпуты формы в конце если data пустое и isAdded === true */}
          {(initialData?.length === 0 ||
            (isAdded && currentObj.level === 1)) && (
            <InputRow
              key={`${currentId}_new_row`}
              initialData={initialData}
              currentId={currentId}
              currentObj={currentObj}
              formData={FormData}
              handleAdd={handleAdd}
              handleChange={handleChange}
              handleDelete={handleDelete}
              lineHeight={lineHeight}
              setCurrentId={setCurrentId}
              setCurrentObj={setCurrentObj}
              isAdded={isAdded}
              isEdited={isEdited}
            />
          )}
        </tbody>
      </table>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
};

export default EditableTable;
