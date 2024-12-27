import React from "react";
import { Button } from "@mui/material";

interface Props {
  onSuggest: () => void;
}

const SuggestCategory: React.FC<Props> = ({ onSuggest }) => {
  return (
    <Button variant="outlined" onClick={onSuggest}>
      Suggest Category
    </Button>
  );
};

export default SuggestCategory;
