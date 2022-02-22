import React from 'react';

import {
  Select,
  MenuItem,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ExpandMore } from '@material-ui/icons';

import Input from 'components/Input.component';

import CheckBox from '@material-ui/core/Checkbox';

const CustomSelect = ({
  blue,
  placeholder,
  options,
  value,
  handleChange,
  className,
  error,
  containerStyles,
  showCheckBox,
  ...otherProps
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container} style={containerStyles}>
      <Select
        className={`${
          blue ? classes.selectContainerBlue : classes.selectContainer
        } ${className} ${error ? classes.errorInput : undefined}`}
        value={value}
        onChange={handleChange}
        displayEmpty
        error={!!error}
        {...otherProps}
        IconComponent={ExpandMore}
        input={<Input containerStyles={{ width: '100%' }} />}
        disableUnderline
      >
        {placeholder && (
          <MenuItem value={''} key="placeholder">
            <Typography className={blue ? undefined : classes.menuItem}>
              {showCheckBox && (
                <CheckBox
                  key={'placeholder_key'}
                  checked={value.length === options.length}
                />
              )}
              {placeholder}
            </Typography>
          </MenuItem>
        )}
        {options &&
          options.map((option, index) => (
            <MenuItem value={option.value} key={index}>
              {showCheckBox && (
                <CheckBox
                  key={index}
                  checked={value.findIndex((x) => x === option.value) >= 0}
                />
              )}
              <Typography className={blue ? undefined : classes.menuItem}>
                {option.label}
              </Typography>
            </MenuItem>
          ))}
      </Select>
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
  selectContainer: {
    '& .MuiSelect-icon': {
      color: theme.palette.common.blue,
    },
    paddingLeft: '0.5rem',
    border: `solid 2px ${theme.palette.common.blue}`,
    //color: theme.palette.common.blue,
    borderRadius: 5,
    width: '10rem',
    height: '2.5rem',
  },
  selectContainerBlue: {
    '& .MuiSelect-icon': {
      color: 'white',
    },
    paddingLeft: '0.5rem',
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    width: '10rem',
  },
  menuItem: {
    color: theme.palette.common.blue,
    fontWeight: 800,
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
    borderColor: theme.palette.common.red,
  },
}));

export default CustomSelect;
