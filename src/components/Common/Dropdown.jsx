import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const Dropdown = (props) => {
  const { label, placeholder, helperText, error, isRequired, ...rest } = props;

  return (
    <Autocomplete
      size="small"
      componentsProps={{
        paper: {
          sx: {
            backgroundColor: "white",
            zIndex: 1300,
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          placeholder={placeholder}
          fullWidth
          error={error}
          helperText={helperText}
          required ={isRequired}
          InputLabelProps={{
            sx: {
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            },
          }}
        />
      )}
      {...props}
    />
  );
};

export default Dropdown;
