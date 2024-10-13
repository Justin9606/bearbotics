import React from "react";
import styled from "@emotion/styled";

type TextButtonProps = {
  label: string;
  onClick: () => void;
  color?: string;
  underline?: boolean;
};

const TextButton: React.FC<TextButtonProps> = ({
  label,
  onClick,
  color,
  underline = false,
}) => {
  return (
    <StyledTextButton onClick={onClick} color={color} underline={underline}>
      {label}
    </StyledTextButton>
  );
};

export default TextButton;

const StyledTextButton = styled.button<{ color?: string; underline?: boolean }>`
  background: none;
  border: none;
  color: ${({ color }) => (color ? color : "#0091FF")};
  text-decoration: ${({ underline }) => (underline ? "underline" : "none")};
  cursor: pointer;
  padding: 0;
  font-size: 14px;
`;
