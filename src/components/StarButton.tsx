import React from "react";
import { IconButton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

type StarButtonProps = {
  starred: boolean;
  onClick: () => void;
};

const StarButton: React.FC<StarButtonProps> = ({ starred, onClick }) => {
  return (
    <IconButton onClick={onClick}>
      {starred ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};

export default StarButton;
