import React, { useState } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography, Popover } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { Info } from '@material-ui/icons';

const ConfigTitle = ({ title, description }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handlePopOverOpen = (e) => {
    if (e) {
      setAnchorEl(e.currentTarget);
    }
    setOpen(true);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const titleText =
    ['proximidad', 'separación'].indexOf(title) < 0
      ? 'CONFIGURACION ALERTAS DE'
      : 'CONFIGURACION ALERTA DE';

  return (
    <div className={classes.configTitleContainer}>
      <Settings className={classes.iconSettings} />
      <Typography className={classes.configTitle} component="h2">
        {`${titleText} ${title.toUpperCase()}`}
      </Typography>
      <Info
        className={classes.infoIconStyle}
        onMouseEnter={handlePopOverOpen}
        onMouseLeave={handlePopOverClose}
      />
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
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
        <Typography>{description}</Typography>
      </Popover>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  configTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  iconSettings: {
    width: '3rem',
    height: '3rem',
    backgroundColor: theme.palette.common.darkMagenta,
    color: 'white',
    borderRadius: '50%',
    padding: '0.5rem',
    marginRight: '0.5rem',
  },
  infoIconStyle: {
    width: '2rem',
    height: '2rem',
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    borderRadius: '50%',
    padding: '0rem',
    marginLeft: '0.5rem',
  },
  configTitle: {
    fontSize: '1.7rem',
    fontWeight: 800,
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: '2px',
    borderRadius: '4px',
  },
}));

export default ConfigTitle;
