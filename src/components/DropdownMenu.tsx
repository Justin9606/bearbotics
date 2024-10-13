import React from "react";
import { Select, MenuItem } from "@mui/material";
import styled from "styled-components";

type DropdownMenuProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <StyledSelect
      value={value}
      onChange={(event: any) => onChange(event.target.value as string)}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default DropdownMenu;

const StyledSelect = styled(Select)`
  height: 45px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
