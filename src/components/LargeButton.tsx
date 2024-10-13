import React from "react";
import styled from "@emotion/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type LargeButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasRightArrow?: boolean;
};

const LargeButton: React.FC<LargeButtonProps> = ({
  label,
  isActive,
  onClick,
  hasRightArrow = false,
}) => {
  return (
    <StyledButton isActive={isActive} onClick={onClick}>
      {label}
      {hasRightArrow && (
        <ArrowForwardIosIcon
          style={{ color: "white", fontSize: "small", marginLeft: "8px" }}
        />
      )}
    </StyledButton>
  );
};

export default LargeButton;

const StyledButton = styled.button<{ isActive: boolean }>`
  background-color: ${({ isActive }) => (isActive ? "#0091FF" : "#e0e0e0")};
  color: white;
  padding: 10px 20px;
  width: 100%;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
