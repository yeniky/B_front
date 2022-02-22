import React from 'react';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';

const CustomButton = ({
  children,
  color,
  className,
  isLoading,
  ...otherProps
}) => {
  const classes = useStyles({ color: color });
  return (
    <Button
      className={`${classes.buttonContainer} ${className}`}
      variant="contained"
      disableRipple
      {...otherProps}
    >
      {isLoading ? (
        <CircularProgress size={20} color={'secondary'} />
      ) : (
        children
      )}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    backgroundColor: (props) => theme.palette.common[props.color],
    color: 'white',
    fontWeight: '800',
    '&:hover': {
      backgroundColor: (props) => theme.palette.common[props.color],
      opacity: 0.7,
    },
    '&:disabled': {
      color: 'lightgrey',
      backgroundColor: (props) => theme.palette.common[props.color],
      opacity: 1.5,
    },
  },
}));

export default CustomButton;
