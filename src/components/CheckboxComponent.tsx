import React from "react";
import { Checkbox } from "@mui/material";

type CheckboxComponentProps = {
  checked: boolean;
  onChange: () => void;
};

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  checked,
  onChange,
}) => {
  return <Checkbox checked={checked} onChange={onChange} />;
};

export default CheckboxComponent;
