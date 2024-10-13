import React from "react";
import { Pagination } from "@mui/material";
import styled from "@emotion/styled";

type PaginationProps = {
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  page: number;
};

const CustomPagination: React.FC<PaginationProps> = ({
  count,
  onChange,
  page,
}) => {
  return (
    <StyledPagination
      count={count}
      color="primary"
      onChange={onChange}
      page={page}
    />
  );
};

export default CustomPagination;

const StyledPagination = styled(Pagination)`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;
