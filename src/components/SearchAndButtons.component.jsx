import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Typography, Input } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import Button from "components/Button.component";

const SearchAndButtons = ({ searchQuery, changeHandler, buttons }) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonsAndSearch}>
      <Input
        className={classes.inputSearch}
        placeholder="Buscar"
        inputProps={{ className: classes.inputSearchProps }}
        endAdornment={<Search className={classes.searchIcon} />}
        disableUnderline
        value={searchQuery}
        onChange={changeHandler}
      />
      <div>
        {buttons &&
          buttons.map((buttonItem) => (
            <Button
              className={classes.buttonProps}
              key={buttonItem.label}
              color="darkMagenta"
              onClick={buttonItem.handleClick}
            >
              <Typography className={classes.buttonText} variant="h5">
                {buttonItem.label}
              </Typography>
            </Button>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.darkMagenta,
  },
  buttonsAndSearch: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  inputSearchProps: {
    fontSize: "1.5rem",
    "&::placeholder": {
      color: theme.palette.common.pink,
    },
  },
  inputSearch: {
    border: `1px solid ${theme.palette.common.darkMagenta}`,
    padding: "0 0.5rem",
    borderRadius: 5,
    height: "2.5rem",
  },
  buttonProps: {
    marginLeft: "1rem",
    height: "2.5rem",
  },
  buttonText: {
    fontSize: "0.9rem",
  },
}));

export default SearchAndButtons;
