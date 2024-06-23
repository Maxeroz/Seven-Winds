import { Fragment } from "react";
import ActionButtons from "../feautres/Table.tsx/ActionButtons";

const getLevel = (rows, level = 1) => {
  return rows.map((item) => {
    const newItem = { ...item, level };

    if (item.child) {
      newItem.child = getLevel(item.child, level + 1);
    }

    return newItem;
  });
};

// Рекурсивная функция для создания рядов таблицы
export const createRowMarkup = (
  row,
  onAdd,
  handleDelete,
  initialData,
  setCurrentId,
  nestRef,
  handleDoubleClick,
  isEdited,
  isAdded,
  currentId,
  handleChange,
  setCurrentObj,
  lineHeight,
  formData,
) => {
  return (
    row?.child &&
    row?.child.map((childRow, i) => {
      return (
        childRow !== currentId && (
          <Fragment key={childRow.id}>
            <tr
              className={`h-[60px] border-y border-borderMain text-white ${isEdited ? "" : "cursor-pointer bg-blue-400"}`}
              onDoubleClick={() => handleDoubleClick(childRow.id)}
            >
              <td style={{ paddingLeft: `${row.level * 30}px` }}>
                {
                  <ActionButtons
                    level="child"
                    onDelete={() => handleDelete(initialData, childRow.id)}
                    id={childRow.id}
                    isAdded={false}
                    isEdited={isEdited}
                    onAdd={onAdd}
                    onCurrentId={setCurrentId}
                    firstChild={i === 0}
                    array={initialData}
                    onCurrentObj={setCurrentObj}
                    lineHeight={lineHeight}
                  />
                }
              </td>
              {/* Имя строки или инпут для редактирования */}
              <td className="w-[500px]">
                {isEdited && currentId === childRow.id ? (
                  <input
                    type="text"
                    name="rowName"
                    defaultValue={childRow.rowName}
                    className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] outline-none"
                    onChange={handleChange}
                  />
                ) : (
                  childRow.rowName
                )}
              </td>
              {/* Зарплата или инпут для редактирования */}
              <td className="w-[140px]">
                {isEdited && currentId === childRow.id ? (
                  <input
                    type="number"
                    name="salary"
                    defaultValue={childRow.salary}
                    className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                    onChange={handleChange}
                  />
                ) : (
                  childRow.salary
                )}
              </td>
              {/* Расходы на оборудование или инпут для редактирования */}
              <td className="w-[120px]">
                {isEdited && currentId === childRow.id ? (
                  <input
                    type="number"
                    name="equipmentCosts"
                    defaultValue={childRow.equipmentCosts}
                    className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                    onChange={handleChange}
                  />
                ) : (
                  childRow.equipmentCosts
                )}
              </td>
              {/* Накладные расходы или инпут для редактирования */}
              <td className="w-[120px]">
                {isEdited && currentId === childRow.id ? (
                  <input
                    type="number"
                    name="overheads"
                    defaultValue={childRow.overheads}
                    className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                    onChange={handleChange}
                  />
                ) : (
                  childRow.overheads
                )}
              </td>
              {/* Ожидаемая прибыль или инпут для редактирования */}
              <td className="w-[120px]">
                {isEdited && currentId === childRow.id ? (
                  <input
                    type="number"
                    name="estimatedProfit"
                    defaultValue={childRow.estimatedProfit}
                    className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                    onChange={handleChange}
                  />
                ) : (
                  childRow.estimatedProfit
                )}
              </td>
            </tr>

            {/* ALL REST NESTED ROWS _____________________________________________*/}
            {childRow.child &&
              createRowMarkup(
                childRow,
                onAdd,
                handleDelete,
                initialData,
                setCurrentId,
                ++nestRef,
                handleDoubleClick,
                isEdited,
                isAdded,
                currentId,
                handleChange,
                setCurrentObj,
                lineHeight,
                formData,
                // handleInsert,
              )}

            {/* ADD NEW ROW ______________________________________________________ */}
            {isAdded && currentId === childRow.id && (
              <Fragment>
                {/* <div>ADD NEW ROW</div> */}

                <tr
                  className={`h-[60px] border-y border-borderMain text-white ${isEdited ? "" : "cursor-pointer bg-red-400"}`}
                  onDoubleClick={() => handleDoubleClick(childRow.id)}
                >
                  <td style={{ paddingLeft: `${childRow.level * 30}px` }}>
                    {
                      <ActionButtons
                        level="child"
                        onDelete={() => handleDelete(initialData, childRow.id)}
                        id={childRow.id}
                        isAdded={true}
                        onAdd={onAdd}
                        onCurrentId={setCurrentId}
                        firstChild={childRow[0] === 0}
                        array={initialData}
                        onCurrentObj={setCurrentObj}
                        lineHeight={lineHeight}
                        key={childRow.id}
                      />
                    }
                  </td>
                  {/* Имя строки или инпут для редактирования */}
                  <td className="w-[500px]">
                    <input
                      type="text"
                      name="rowName"
                      defaultValue={formData.rowName}
                      className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] outline-none"
                      onChange={handleChange}
                    />
                  </td>
                  {/* Зарплата или инпут для редактирования */}
                  <td className="w-[140px]">
                    <input
                      type="number"
                      name="salary"
                      defaultValue={formData.salary}
                      className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                      onChange={handleChange}
                    />
                  </td>
                  {/* Расходы на оборудование или инпут для редактирования */}
                  <td className="w-[120px]">
                    <input
                      type="number"
                      name="equipmentCosts"
                      defaultValue={formData.equipmentCosts}
                      className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                      onChange={handleChange}
                    />
                  </td>
                  {/* Накладные расходы или инпут для редактирования */}
                  <td className="w-[120px]">
                    <input
                      type="number"
                      name="overheads"
                      defaultValue={formData.overheads}
                      className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                      onChange={handleChange}
                    />
                  </td>
                  {/* Ожидаемая прибыль или инпут для редактирования */}
                  <td className="w-[120px]">
                    <input
                      type="number"
                      name="estimatedProfit"
                      defaultValue={formData.estimatedProfit}
                      className="h-[30px] w-full rounded-[6px] border border-borderMain bg-transparent px-[10px] text-left outline-none"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </Fragment>
            )}
          </Fragment>
        )
      );
    })
  );
};
