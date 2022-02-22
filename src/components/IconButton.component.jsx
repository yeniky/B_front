import React, { useState, useEffect } from 'react';
import { IconButton, Popover, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  CheckCircle,
  Cancel,
  AddCircle,
  Visibility,
  Delete,
  Edit,
  Mail,
  Unsubscribe,
} from '@material-ui/icons';

const CustomIconButton = ({
  cancel,
  accept,
  remove,
  add,
  eye,
  edit,
  subscribe,
  unsubscribe,
  className,
  helperText,
  ...otherProps
}) => {
  const classes = useStyles();

  const [showText, setShowText] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [popoverText, setPopoverText] = useState(helperText || '');

  useEffect(() => {
    if (!helperText) {
      // if (add) {
      //   setPopoverText('Agregar');
      // }
      // if (remove) {
      //   setPopoverText('Eliminar');
      // }
      // if (eye) {
      //   setPopoverText('Archivar');
      // }
      // if (edit) {
      //   setPopoverText('Editar');
      // }
      // if (subscribe) {
      //   setPopoverText('Suscribirse');
      // }
      // if (unsubscribe) {
      //   setPopoverText('Cancelar suscripción');
      // }
      // if (accept) {
      //   setPopoverText('Aceptar');
      // }
      // if (cancel) {
      //   setPopoverText('Cancelar');
      // }
    }
  }, []);

  const handlePopOverOpen = (e) => {
    if (popoverText) {
      if (e) {
        setAnchorEl(e.currentTarget);
      }
      setShowText(true);
    }
  };

  const handlePopOverClose = () => {
    if (anchorEl !== null) {
      setAnchorEl(null);
    }
    setShowText(false);
  };

  return (
    <IconButton
      className={`${classes.iconButton} ${className}`}
      disableRipple
      onMouseEnter={handlePopOverOpen}
      onMouseLeave={handlePopOverClose}
      {...otherProps}
    >
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={!!popoverText && showText}
        anchorEl={popoverText ? anchorEl : null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopOverClose}
        disableRestoreFocus
      >
        <Typography>{popoverText}</Typography>
      </Popover>
      {cancel && <Cancel className={classes.iconCancel} />}
      {accept && <CheckCircle className={classes.iconAccept} />}
      {remove && <Delete className={classes.iconRemove} />}
      {add && <AddCircle className={classes.iconAccept} />}
      {eye && <Visibility className={classes.iconEye} />}
      {edit && <Edit className={classes.iconEdit} />}
      {subscribe && <Mail className={classes.iconSubscribe} />}
      {unsubscribe && <Unsubscribe className={classes.iconUnsubscribe} />}
    </IconButton>
  );
};

const useStyles = makeStyles((theme) => ({
  iconButton: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 0,
  },
  iconAccept: {
    width: '2.5rem',
    height: '2.5rem',
    color: theme.palette.common.green,
  },
  iconEdit: {
    width: '2.3rem',
    height: '2.3rem',
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    borderRadius: '50%',
    padding: '0.4rem',
    // color: '#10384f',
  },
  iconSubscribe: {
    width: '2.3rem',
    height: '2.3rem',
    backgroundColor: theme.palette.common.green,
    color: 'white',
    borderRadius: '50%',
    padding: '0.5rem',
  },
  iconUnsubscribe: {
    width: '2.3rem',
    height: '2.3rem',
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.red,
    borderRadius: '50%',
    padding: '0.3rem',
    paddingBottom: '0.1rem',
  },
  iconCancel: {
    width: '2.5rem',
    height: '2.5rem',
    color: '#CE3B2C',
  },
  iconRemove: {
    width: '2.3rem',
    height: '2.3rem',
    backgroundColor: theme.palette.common.red,
    color: 'white',
    borderRadius: '50%',
    padding: '0.4rem',
  },
  iconEye: {
    width: '2.3rem',
    height: '2.3rem',
    backgroundColor: theme.palette.common.red,
    color: 'white',
    borderRadius: '50%',
    padding: '0.5rem',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: '2px',
    borderRadius: '4px',
  },
}));

export default CustomIconButton;
