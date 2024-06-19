import React, { useEffect, useState } from "react";
import { API_ID, API_URL } from "../../config";
// import ActionButtons from "./ActionButtons";

const EditableTable = () => {
  const [initialData, setInitialData] = useState(null);

  // const [formData, setFormData] = useState({
  //   id: 0,
  //   rowName: "",
  //   salary: 0,
  //   equipment: 0,
  //   overhead: 0,
  //   profit: 0,
  //   level: 0,
  //   parentId: undefined,
  // });

  const [formData, setFormData] = useState({
    id: 0,
    rowName: "",
    salary: 0,
    equipment: 0,
    overhead: 0,
    profit: 0,
    level: 0,
    parentId: undefined,
  });

  useEffect(() => {
    const fetchData = async function (url, id) {
      const res = await fetch(`${url}/v1/outlay-rows/entity/${id}/row/list`);

      const data = await res.json();
      setInitialData(data);
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
    const res = await fetch(`${url}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // fetch(`${url}/v1/outlay-rows/entity/${id}/row/create`, { method: POST });
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
                  type="text"
                  value={formData.salary}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="text"
                  value={formData.equipmentCosts}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="text"
                  value={formData.supportCosts}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
              <th className="h-[42px] text-left font-normal">
                <input
                  type="text"
                  value={formData.estimatedProfit}
                  className="h-[30px] w-[90%] rounded-[6px] border border-borderMain bg-transparent px-3 outline-none"
                  onChange={handleChange}
                />
              </th>
            </tr>
          )}
          {initialData?.length > 0 &&
            initialData.map((row) => (
              <tr key={row.id} className="h-[60px] text-white">
                <td>{/* <ActionButtons id={row.id} /> */}</td>
                <td>{row.rowName}</td>
                <td>{row.salary}</td>
                <td>{row.equipmentCosts}</td>
                <td>{row.supportCosts}</td>
                <td>{row.estimatedProfit}</td>
              </tr>
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
