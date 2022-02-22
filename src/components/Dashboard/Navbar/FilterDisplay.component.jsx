import React, { useMemo } from "react";

import { makeStyles } from "@material-ui/styles";
import { FilterList } from "@material-ui/icons";

import Select from "components/Select.component";

const FilterDisplay = ({
  display,
  zones,
  tags,
  batchs,
  filterFormData,
  onFilterFormChange,
  resetFilters,
}) => {
  const classes = useStyles();

  const { batchValue, zoneValue, tagValue } = filterFormData;

  const tagOptions = useMemo(
    () => tags.map((tag) => ({ label: tag.address, value: tag.id })),
    [tags]
  );
  const zoneOptions = useMemo(
    () => zones.map((zone) => ({ label: zone.name, value: zone.name })),
    [zones]
  );
  const batchOptions = useMemo(
    () => batchs.map((batch) => ({ label: batch.name, value: batch.name })),
    [batchs]
  );

  return display ? (
    <section className={classes.container}>
      <FilterList className={classes.filterLogo} onClick={resetFilters} />
      <Select
        className={classes.selectContainer}
        placeholder="Batch"
        options={batchOptions}
        value={batchValue}
        handleChange={onFilterFormChange}
        name="batchValue"
        blue
      />
      <Select
        className={classes.selectContainer}
        placeholder="Zona"
        options={zoneOptions}
        value={zoneValue}
        handleChange={onFilterFormChange}
        name="zoneValue"
        blue
      />
      <Select
        className={classes.selectContainer}
        placeholder="Tag"
        options={tagOptions}
        value={tagValue}
        handleChange={onFilterFormChange}
        name="tagValue"
        blue
      />
    </section>
  ) : null;
};

const useStyles = makeStyles((theme) => ({
  container: {
    transition: "all 0.2s ease-in-out",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  filterLogo: {
    color: "white",
    height: "2.2rem",
    width: "3rem",
    cursor: "pointer",
  },
  selectContainer: {
    backgroundColor: theme.palette.common.blue,
    color: "white",
    width: "10rem",
  },
}));

export default FilterDisplay;
