import React from "react";
import { TextField, InputLabel, InputAdornment } from "@mui/material";
import { Control, useController } from "react-hook-form";

interface MuiFormInputProps {
  control: Control;
  title: string;
  name: string;
  // onChange?:any;
  label?: string;
  style?: any;
  type?: string;
  defaultValue?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  rules?: Record<string, any>; // Validation rules specific to the field
}

export const InputBox: React.FC<MuiFormInputProps> = ({
  control,
  prefixIcon,
  suffixIcon,
  name,
  style,
  label,
  title,
  type,
  rules,
  defaultValue,
}) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  return (
    <>
      <InputLabel>{title}</InputLabel>
      <TextField
        label={label}
        type={type}
        {...inputProps}
        inputRef={ref}
        // onChange={onChange}
        error={invalid}
        sx={style}
        defaultValue={defaultValue}
        helperText={error?.message}
        InputProps={{
          startAdornment: prefixIcon ? (
            <InputAdornment position="start">{prefixIcon}</InputAdornment>
          ) : undefined,
          endAdornment: suffixIcon ? (
            <InputAdornment position="end">{suffixIcon}</InputAdornment>
          ) : undefined,
        }}
      />
    </>
  );
};
