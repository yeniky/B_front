import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";

const NavButton = ({ children, active, onClick, ...otherProps }) => {
  const classes = useStyles();
  return (
    <Button
      className={`${classes.navButton} ${active ? classes.active : undefined}`}
      onClick={onClick}
      disableRipple
      {...otherProps}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  navButton: {
    color: "white",
    fontFamily: "Didact Gothic, sans-serif",
    fontWeight: "800",
    padding: "0.2rem 1.9rem",
    border: `0.1rem solid ${theme.palette.common.blue}`,
    marginRight: "0.3rem",
    borderRadius: 5,
    backgroundColor: theme.palette.common.darkMagenta,
    textAlign: "center",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: theme.palette.common.blue,
      borderColor: "black",
    },
  },
  active: {
    backgroundColor: theme.palette.common.blue,
    borderColor: theme.palette.common.blue,
  },
}));

export default NavButton;
