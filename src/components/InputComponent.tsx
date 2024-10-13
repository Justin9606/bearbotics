import React from "react";
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

interface InputComponentProps {
  placeholder: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  placeholder,
  onSearch,
}) => {
  return (
    <StyledSearchInput
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        endAdornment: (
          <IconButton>
            <SearchIcon />
          </IconButton>
        ),
      }}
      onChange={onSearch}
    />
  );
};

export default InputComponent;

const StyledSearchInput = styled(TextField)`
  input {
    padding: 10px 12px;
  }
  .MuiOutlinedInput-root {
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }
`;
