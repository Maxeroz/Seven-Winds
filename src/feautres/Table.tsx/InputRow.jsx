import ActionButtons from "./ActionButtons";

function InputRow({
  currentObj,
  formData,
  handleAdd,
  setCurrentId,
  setCurrentObj,
  isAdded,
  isEdited,
  lineHeight,
  currentId,
  handleDelete,
  handleChange,
  initialData,
}) {
  return (
    <tr className="h-[60px] bg-green-400">
      <th
        className="h-[42px] text-left font-normal"
        style={{ paddingLeft: `${currentObj.level * 30}px` }}
      >
        <ActionButtons
          // check inputs
          onDelete={() => handleDelete()}
          onAdd={handleAdd}
          onCurrentId={setCurrentId}
          isEdited={isEdited}
          isAdded={isAdded}
          level={initialData?.length === 0 ? "" : "child"}
          array={initialData}
          onCurrentObj={setCurrentObj}
          lineHeight={lineHeight}
          currentId={currentId}
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
  );
}

export default InputRow;
