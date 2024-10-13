import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import RedoIcon from "@mui/icons-material/Redo";

type TableData = {
  id: number;
  name: string;
  isActive: boolean;
  robot: { id: string; is_online: boolean };
  type: string;
  starred: boolean;
};

type CustomTableProps = {
  data: TableData[];
  setData: React.Dispatch<React.SetStateAction<TableData[]>>;
  renderRow: (row: TableData) => JSX.Element;
};

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  setData,
  renderRow,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedData = data.map((item) => ({
      ...item,
      starred: selectAll ? false : true,
    }));
    setData(updatedData);
  };

  const handleRedoAllStars = () => {
    const updatedData = data.map((item) => ({
      ...item,
      starred: !item.starred,
    }));
    setData(updatedData);
  };

  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <StyledTableHeadCell padding="checkbox" style={{ width: "5%" }}>
              <Checkbox checked={selectAll} onChange={handleSelectAll} />
            </StyledTableHeadCell>
            <StyledTableHeadCell style={{ width: "5%" }}>
              <IconButton onClick={handleRedoAllStars}>
                <RedoIcon />
              </IconButton>
            </StyledTableHeadCell>
            <StyledTableHeadCell style={{ width: "40%" }}>
              Locations
            </StyledTableHeadCell>
            <StyledTableHeadCell style={{ width: "30%" }}>
              Robots
            </StyledTableHeadCell>
            <StyledTableHeadCell style={{ width: "20%" }}>
              Location Types
            </StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>{data.map(renderRow)}</TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default CustomTable;

const StyledTableCell = styled(TableCell)`
  border-right: 1px solid #e0e0e0;
  padding: 12px;
  &:last-child {
    border-right: none;
  }
`;

const StyledTableHeadCell = styled(StyledTableCell)`
  font-weight: bold;
  background-color: #f9f9f9;
`;

const StyledTableContainer = styled(TableContainer)`
  width: 100%;
  margin: 0 auto;
`;

const StyledTable = styled(Table)`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  table-layout: fixed;
`;
