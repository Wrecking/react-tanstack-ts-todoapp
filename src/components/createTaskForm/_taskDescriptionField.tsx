import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import { ITextField } from './interfaces/ITextField';
import PropTypes from 'prop-types';

export const TaskDescriptionField: FC<ITextField> = (props): ReactElement => {
  // Destructure props
  const {
    value = '',
    onChange = (e) => console.log(e.target.value), // default function
    disabled = false, // default parameter
  } = props;

  return (
    <TextField
      value={value}
      id="description"
      name="description"
      label="Description"
      placeholder="Description"
      variant="outlined"
      size="medium"
      multiline
      rows={4}
      fullWidth
      disabled={disabled}
      onChange={onChange}
      inputProps={{ maxLength: 250 }}
    />
  );
};

TaskDescriptionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
