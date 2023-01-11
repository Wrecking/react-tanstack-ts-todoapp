import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import { ITextField } from './interfaces/ITextField';
import PropTypes from 'prop-types';

export const TaskTitleField: FC<ITextField> = (props): ReactElement => {
  // Destructure props
  const {
    value = '',
    onChange = (e) => console.log(e.target.value), // default function
    disabled = false, // default parameter
  } = props;

  return (
    <TextField
      value={value}
      id="title"
      name="title"
      label="Task Title"
      placeholder="Task Title"
      variant="outlined"
      size="medium"
      fullWidth
      disabled={disabled}
      onChange={onChange}
      inputProps={{ maxLength: 65 }}
    />
  );
};

TaskTitleField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
