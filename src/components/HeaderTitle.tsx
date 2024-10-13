import React from "react";
import styled from "@emotion/styled";

type HeaderTitleProps = {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
};

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  text,
  fontSize,
  fontWeight,
}) => {
  return (
    <StyledHeaderTitle fontSize={fontSize} fontWeight={fontWeight}>
      {text}
    </StyledHeaderTitle>
  );
};

export default HeaderTitle;

const StyledHeaderTitle = styled.p<{
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}>`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "24px")};
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : "bold")};
  color: ${({ color }) => (color ? color : "#000")};
  margin: 0;
  padding: 16px 0;
`;
