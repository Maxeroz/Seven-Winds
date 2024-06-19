import React, { Fragment, useEffect, useState } from "react";
import { API_ID, API_URL } from "../../config";
import ActionButtons from "./ActionButtons";
// import ActionButtons from "./ActionButtons";

const createRowMarkup = (row) => {
  return (
    row?.child &&
    row?.child.map((childRow) => {
      return (
        <Fragment key={childRow.id}>
          <tr className="h-[60px] border-y border-borderMain text-white">
            <td style={{ paddingLeft: `${row.level * 30}px` }}>
              {<ActionButtons level="child" />}
            </td>
            <td>{childRow.rowName}</td>
            <td>{childRow.salary}</td>
            <td>{childRow.equipmentCosts}</td>
            <td>{childRow.overheads}</td>
            <td>{childRow.estimatedProfit}</td>
          </tr>
          {childRow.child && createRowMarkup(childRow)}
        </Fragment>
      );
    })
  );
};

const EditableTable = () => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [formData, setFormData] = useState({
    id: 0,
    rowName: "",
    salary: 0,
    equipmentCosts: 0,
    overheads: 0,
    estimatedProfit: 0,
    level: 0,
    parentId: undefined,
  });

  useEffect(() => {
    const fetchData = async function (url, id) {
      setIsLoading(true);

      const res = await fetch(`${url}/v1/outlay-rows/entity/${id}/row/list`);

      const data = await res.json();
      setInitialData(getLevel(data));

      setIsLoading(false);

      return data;
    };

    fetchData(API_URL, API_ID);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "rowName" ? value : parseFloat(value),
    });
  };

  const createRow = async function () {
    const newRow = {
      equipmentCosts: formData.equipmentCosts,
      estimatedProfit: formData.estimatedProfit,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: formData.overheads,
      parentId: formData.parentId || null,
      rowName: formData.rowName,
      salary: formData.salary,
      supportCosts: 0,
    };

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

      setInitialData((currentRows) => [...currentRows, data.current]);
      console.log("Row created successfully:", data);
    } catch (error) {
      console.error("Error creating row:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createRow();
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
            <th className="h-[42px] text-left font-normal">Основная з/п</th>
            <th className="h-[42px] text-left font-normal">Оборудование</th>
            <th className="h-[42px] text-left font-normal">
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
          {/* Display form inputs if data is empty */}
          {initialData?.length === 0 && (
            <tr className="h-[60px]">
              <th className="h-[42px] w-[110px] text-left font-normal">
                Кнопки
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
          {initialData?.length > 0 &&
            initialData.map((row) => (
              <Fragment key={row.id}>
                <tr className="h-[60px] border-y border-borderMain text-white">
                  <td>
                    <ActionButtons />
                  </td>
                  <td>{row.rowName}</td>
                  <td>{row.salary}</td>
                  <td>{row.equipmentCosts}</td>
                  <td>{row.overheads}</td>
                  <td>{row.estimatedProfit}</td>
                </tr>
                {createRowMarkup(row)}
              </Fragment>
            ))}
        </tbody>
      </table>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
};

export default EditableTable;
