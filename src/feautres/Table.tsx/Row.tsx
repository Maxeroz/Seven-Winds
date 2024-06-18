import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import { useState } from "react";

export default function Row() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <>
      <div className="border-t border-borderMain">
        <TableRow
          sx={{
            height: "60px",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={handleClick}>Level</IconButton>
          <TableCell>Южная строительная площадка</TableCell>
          <TableCell sx={{ borderColor: "#414144" }}>20 348</TableCell>
          <TableCell>1 750</TableCell>
          <TableCell>108,07</TableCell>
          <TableCell>1 209 122,5</TableCell>
        </TableRow>
      </div>
      <div>
        <TableRow>
          <Collapse in={isOpen} timeout="auto">
            <TableCell>Фундаментальные работы</TableCell>
          </Collapse>
        </TableRow>
      </div>
    </>
  );
}
