export const deleteRow = async function (
  url: string,
  id: number,
  rowId: number,
) {
  const res = await fetch(
    `${url}/v1/outlay-rows/entity/${id}/row/${rowId}/delete`,
    {
      method: "DELETE",
    },
  );

  if (res.ok) {
    console.log("deleted");
  } else {
    console.error("Failed to delete row:", res.status, res.statusText);
  }
};
