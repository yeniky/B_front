import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

const CustomModalTitle = ({ title, Icon, ...otherProps }) => {
  const classes = useStyles();
  return (
    <div className={classes.container} {...otherProps}>
      <Icon className={classes.icon} />
      <Typography
        className={classes.title}
        component="h2"
      >{`${title}`}</Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  icon: {
    width: "3.2rem",
    height: "3.2rem",
    backgroundColor: theme.palette.common.blue,
    color: "white",
    borderRadius: "50%",
    padding: "0.5rem",
    marginRight: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 900,
    color: theme.palette.common.blue,
  },
}));

export default CustomModalTitle;
