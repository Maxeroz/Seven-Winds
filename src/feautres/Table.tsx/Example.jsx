import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import styles from "./EditableTable.module.css";

// const initialData = [];

const initialData = [
  {
    id: 1,
    name: "Южная строительная площадка",
    salary: 20348,
    equipment: 1750,
    overhead: 108.07,
    profit: 1209122.5,
    level: 0,
  },
  // {
  //   id: 2,
  //   name: "Фундаментальные работы",
  //   salary: 20348,
  //   equipment: 1750,
  //   overhead: 108.07,
  //   profit: 1209122.5,
  //   level: 1,
  //   parentId: 1,
  // },
  // {
  //   id: 3,
  //   name: "Статья работы № 1",
  //   salary: 20348,
  //   equipment: 1750,
  //   overhead: 108.07,
  //   profit: 189122.5,
  //   level: 2,
  //   parentId: 2,
  // },
  // {
  //   id: 4,
  //   name: "Статья работы № 2",
  //   salary: 38200,
  //   equipment: 1200,
  //   overhead: 850,
  //   profit: 1020000,
  //   level: 2,
  //   parentId: 2,
  // },
];

const EditableTable = () => {
  const [isNew, setIsNew] = useState(false);
  const [data, setData] = useState(initialData);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    salary: 0,
    equipment: 0,
    overhead: 0,
    profit: 0,
    level: 0,
    parentId: undefined,
  });

  const [expandedRows, setExpandedRows] = useState([1, 2]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : parseFloat(value),
    });
  };

  const handleSumbit = (e) => {
    e.preventDefault();

    const formDataObject = {
      id: formData.id,
      name: formData.name,
      salary: formData.salary,
      equipment: formData.equipment,
      overhead: formData.overhead,
      profit: formData.profit,
    };

    setData((prevState) => [...prevState, formDataObject]);
  };

  const handleAddNewRow = (level) => {
    // setFormData({
    //   id: 0,
    //   name: "",
    //   salary: 0,
    //   equipment: 0,
    //   overhead: 0,
    //   profit: 0,
    //   level: 0,
    //   parentId: undefined,
    // });
    // setIsNew(true);
  };

  const handleEdit = (id) => {
    const editRow = data.find((row) => row.id === id);
    if (editRow) {
      setEditId(id);
      setFormData(editRow);
      setIsNew(false);
    }
  };

  const handleDelete = (id) => {
    setData(data.filter((row) => row.id !== id && row.parentId !== id));
  };

  const handleSave = () => {
    if (isNew) {
      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const newRow = { ...formData, id: newId };
      setData([...data, newRow]);
    } else {
      setData(data.map((row) => (row.id === editId ? formData : row)));
    }
    setEditId(null);
    setFormData({});
    setIsNew(false);
  };

  const toggleRow = (id) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );
  };

  const renderRows = (rows, level = 0, parentId) => {
    if (rows.length === 0) {
      return (
        <tr>
          <td>
            <ActionButtons
              onAdd={(e) => {
                handleAddNewRow();
              }}
              onDelete={() => handleDelete()}
              // level={level}
            />
          </td>
          <td>
            <input
              className="w-[90%] rounded-[6px] border border-borderMain bg-transparent px-2 py-0.5"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите наименование работы..."
            />
          </td>
          <td>
            <input
              className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
              type="number"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
              type="number"
              name="overhead"
              value={formData.overhead}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
              type="number"
              name="profit"
              value={formData.profit}
              onChange={handleChange}
            />
          </td>
        </tr>
      );
    }

    return (
      <>
        {rows
          .filter((row) => row.level === level && row.parentId === parentId)
          .map((row) => (
            <React.Fragment key={row.id}>
              <tr className="h-[60px]">
                <td style={{ paddingLeft: `${level * 25}px` }}>
                  {editId === row.id ? (
                    <button onClick={handleSave}>Сохранить</button>
                  ) : (
                    <ActionButtons
                      onAdd={() => handleAddNewRow()}
                      onDelete={() => handleDelete(row.id)}
                      level={level}
                    />
                  )}
                </td>
                <td>
                  {editId === row.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td>
                  {editId === row.id ? (
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  ) : (
                    row.salary
                  )}
                </td>
                <td>
                  {editId === row.id ? (
                    <input
                      type="number"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                    />
                  ) : (
                    row.equipment
                  )}
                </td>
                <td>
                  {editId === row.id ? (
                    <input
                      type="number"
                      name="overhead"
                      value={formData.overhead}
                      onChange={handleChange}
                    />
                  ) : (
                    row.overhead
                  )}
                </td>
                <td>
                  {editId === row.id ? (
                    <input
                      type="number"
                      name="profit"
                      value={formData.profit}
                      onChange={handleChange}
                    />
                  ) : (
                    row.profit
                  )}
                </td>
              </tr>
              {isNew && (
                <tr>
                  <td style={{ paddingLeft: `${level * 25}px` }}>
                    {editId === row.id ? (
                      <button onClick={handleSave}>Сохранить</button>
                    ) : (
                      <ActionButtons
                        onAdd={() => handleAddNewRow()}
                        onDelete={() => handleDelete(row.id)}
                        level={level}
                      />
                    )}
                  </td>
                  <td>
                    <input
                      className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
                      type="number"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
                      type="number"
                      name="overhead"
                      value={formData.overhead}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="w-[90%] rounded-[6px] border border-borderMain bg-transparent py-0.5"
                      type="number"
                      name="profit"
                      value={formData.profit}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              )}
              {expandedRows.includes(row.id) &&
                renderRows(rows, level + 1, row.id)}
            </React.Fragment>
          ))}
      </>
    );
  };

  return (
    <form onSubmit={handleSumbit}>
      <table className="w-full text-sm">
        <thead>
          <tr>
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
        <tbody className="text-white">{renderRows(data)}</tbody>
      </table>
    </form>
  );
};

export default EditableTable;
