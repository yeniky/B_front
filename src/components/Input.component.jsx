import React from 'react';

import { Input, FormHelperText, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const CustomInput = ({
  className,
  classNameInput,
  placeholder,
  value,
  handleChange,
  maxLength,
  maxDate,
  multiline,
  disabled,
  error,
  containerStyles,
  endAdornment,
  ...otherProps
}) => {
  const classes = useStyles({
    height: multiline ? undefined : '2.5rem',
    padding: multiline ? '3px 5px' : '0 5px',
  });

  return (
    <div className={classes.container} style={containerStyles}>
      <Input
        className={`${classes.customInput} ${className} ${
          disabled ? classes.customInputDisabled : undefined
        } ${error ? classes.errorInput : undefined}`}
        placeholder={placeholder || ''}
        value={value}
        onChange={handleChange}
        multiline={multiline}
        inputProps={{
          className: `${classes.inputProps} ${classNameInput}`,
          maxLength: maxLength,
          max: maxDate,
        }}
        disabled={disabled}
        disableUnderline
        error={!!error}
        endAdornment={
          endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null
        }
        {...otherProps}
      />
      {!!error && (
        <FormHelperText className={classes.formError} error>
          <span>{error}</span>
        </FormHelperText>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'relative',
  },
  customInput: {
    border: `solid 2px ${theme.palette.common.blue}`,
    padding: (props) => props.padding,
    borderRadius: 5,
    width: '10rem',
    height: (props) => props.height,
    color: theme.palette.common.blue,
    fontWeight: 700,
  },
  inputProps: {
    '&::placeholder': {
      color: theme.palette.common.blue,
      fontWeight: 700,
      opacity: 1,
    },
  },
  customInputDisabled: {
    border: `solid 2px ${theme.palette.common.grey}`,
    backgroundColor: theme.palette.common.grey,
  },
  formError: {
    position: 'absolute',
    bottom: '-1rem',
    right: 5,
    '& span': {
      fontSize: '0.7rem',
    },
  },
  errorInput: {
    borderColor: `${theme.palette.common.red} !important`,
  },
}));

export default CustomInput;
