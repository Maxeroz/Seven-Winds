import { Fragment, useEffect, useRef, useState } from "react";
import { API_ID, API_URL } from "../../config";
import ActionButtons from "./ActionButtons";
import { createRowMarkup } from "../../utils/createRowMarkUp.jsx";
// import ActionButtons from "./ActionButtons";

// Главный компонент таблицы
const EditableTable = () => {
  // Состояния компонента
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

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

  const getLevel = (rows) => {
    const modifiedRows = rows.map((item) => {
      if (item.child) {
        const obj = {
          ...item, // Копирование свойств из исходного элемента
          level: ++initialLevel,
          child: getLevel(item.child), // Добавление нового свойства
        };
        initialLevel = 0;
        return obj;
      }

      return { ...item, level: 0 };
    });

    return modifiedRows;
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

    setInitialData(modified);
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

  useEffect(() => {
    const fetchData = async function (url, id) {
      setIsLoading(true);

      try {
        const res = await fetch(`${url}/v1/outlay-rows/entity/${id}/row/list`);

        setIsLoading(false);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setInitialData(getLevel(data));

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

        setInitialData((items) =>
          getLevel(addChildToNestedItem(items, currentId, data)),
        );

        setIsAdded(false);
        setCurrentId(null);

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

        console.log("Row created successfully:", data);
      } catch (error) {
        console.error("Error creating row:", error);
      }
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
    setCurrentId(rowId);
    setIsEdited(true);
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
            initialData.map((row) => (
              <Fragment key={row.id}>
                {/* Основной ряд таблицы */}
                <tr
                  className="h-[60px] border-y border-borderMain text-white"
                  onDoubleClick={() => handleDoubleClick(row.id)}
                >
                  <td>
                    <ActionButtons
                      onDelete={() => handleDelete(initialData, row.id)}
                      onAdd={handleAdd}
                      id={row.id}
                      onCurrentId={setCurrentId}
                      isEdited={isEdited}
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
                  currentId,
                  handleChange,
                )}
              </Fragment>
            ))}
          {/* Отобразить форм инпуты если data пустое и isAdded === true */}
          {(initialData?.length === 0 || isAdded) && (
            <tr className="h-[60px]">
              <th className="h-[42px] text-left font-normal">
                <ActionButtons
                  onDelete={() => handleDelete(initialData, row.id)}
                  onAdd={handleAdd}
                  onCurrentId={setCurrentId}
                  isEdited={isEdited}
                />
              </th>
              <th className="h-[42px] w-[500px] text-left font-normal">
                <input
                  type="text"
                  name="rowName"
                  value={formData.rowName}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="number"
                  name="equipmentCosts"
                  value={formData.equipmentCosts}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="number"
                  name="overheads"
                  value={formData.overheads}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="number"
                  name="estimatedProfit"
                  value={formData.estimatedProfit}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
            </tr>
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
