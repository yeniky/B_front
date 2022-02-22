import React, { useState } from "react";

//styles components
import { makeStyles } from "@material-ui/styles";

//components
import Button from "components/Button.component";
import IconButton from "components/IconButton.component";
import Select from "components/Select.component";

const AddItem = ({
  selectParams,
  selectValue,
  onSelectChange,
  onAddItem,
  buttonParams,
  disabled,
}) => {
  const classes = useStyles();

  const [showAddItem, setShowAddItem] = useState(false);

  const { placeholder, options } = selectParams;
  const { label, onClick } = buttonParams;

  return (
    <div className={classes.container}>
      {showAddItem ? (
        <div className={classes.addItemContainer}>
          <div className={classes.addItemForm}>
            <Select
              className={classes.selectItem}
              placeholder={placeholder}
              value={selectValue}
              options={options}
              handleChange={onSelectChange}
            />
            <IconButton
              accept
              className={classes.controlButton}
              onClick={onAddItem}
            />
            <IconButton
              cancel
              className={classes.controlButton}
              onClick={() => setShowAddItem(false)}
            />
          </div>
          <Button color="darkMagenta" onClick={onClick}>
            {label}
          </Button>
        </div>
      ) : (
        <IconButton
          add
          onClick={() => (disabled ? undefined : setShowAddItem(true))}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "1rem 0",
  },
  addItemContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addItemForm: {
    display: "flex",
  },
  selectItem: {
    width: "15rem",
  },
  controlButton: {
    marginLeft: "0.5rem",
  },
}));

export default AddItem;
