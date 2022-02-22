import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Select from 'components/Select.component';
import Input from 'components/Input.component';
import CheckBox from '@material-ui/core/Checkbox';
import Button from 'components/Button.component';
import {
  previousHour,
  previousDay,
  previousWeek,
  previousMonth,
} from 'utils/dates';

// const ITEM_HEIGHT = 54;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   style: {
//     maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
//     // width: 500,
//   },
// };

const ZoneHistoryFiltersForm = ({
  filters,
  onChangeHandler,
  formErrors,
  tagsList,
  batchesList,
  zonesList,
  onPredefinedDateRange,
}) => {
  const classes = useStyles();

  console.log(filters);

  const containerOptions = tagsList
    .filter((tag) => !!tag.container)
    .map((typeItem) => ({
      label: typeItem.container,
      value: typeItem.container,
    }));

  const macOptions = tagsList.map((typeItem) => ({
    label: typeItem.address,
    value: typeItem.address,
  }));

  const batchOptions = batchesList.map((typeItem) => ({
    label: typeItem.name,
    value: typeItem.name,
  }));

  const zoneOptions = zonesList.map((typeItem) => ({
    label: typeItem.name,
    value: typeItem.name,
  }));

  return (
    <div className={classes.container}>
      <div className={classes.selectorsContainer}>
        <div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="container_selected"
                checked={!!filters.container?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Bin:" />
            </div>
            <Select
              disabled={!filters.container?.isSelected}
              name="container"
              options={containerOptions}
              value={filters.container?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.container}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione bins'}</p>;
                }
                if (selected.length === containerOptions.length) {
                  return <p>{'Todos los bins'}</p>;
                }

                return selected.join(', ');
              }}
              // MenuProps={MenuProps}
            />
          </div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="address_selected"
                checked={!!filters.address?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Mac:" />
            </div>
            <Select
              disabled={!filters.address?.isSelected}
              name="address"
              options={macOptions}
              value={filters.address?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.address}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione macs'}</p>;
                }
                if (selected.length === macOptions.length) {
                  return <p>{'Todas las macs'}</p>;
                }

                return selected.join(', ');
              }}
              // MenuProps={MenuProps}
            />
          </div>
        </div>
        <div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="batch_selected"
                checked={!!filters.batch?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Batch:" />
            </div>
            <Select
              disabled={!filters.batch?.isSelected}
              name="batch"
              options={batchOptions}
              value={filters.batch?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.batch}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione batchs'}</p>;
                }
                if (selected.length === batchOptions.length) {
                  return <p>{'Todos los batchs'}</p>;
                }

                return selected.join(', ');
              }}
              // MenuProps={MenuProps}
            />
          </div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="zone_selected"
                checked={!!filters.zone?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Zona:" />
            </div>
            <Select
              disabled={!filters.zone?.isSelected}
              name="zone"
              options={zoneOptions}
              value={filters.zone?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.zone}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione zonas'}</p>;
                }
                if (selected.length === zoneOptions.length) {
                  return <p>{'Todos las zonas'}</p>;
                }

                return selected.join(', ');
              }}
              // MenuProps={MenuProps}
            />
          </div>
        </div>
        <div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="permanence_selected"
                checked={!!filters.permanence?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Permanencia:" />
            </div>
            <Input
              disabled={!filters.permanence?.isSelected}
              name="permanence_start"
              value={filters.permanence?.value?.start || []}
              type="number"
              handleChange={onChangeHandler}
              error={formErrors.permanence}
              className={classes.formPermanenceInput}
              endAdornment={'min'}
              placeholder={'0'}
            ></Input>
            <div className={classes.permanenceSeparator}>
              <Label textLabel=" - " />
            </div>
            <Input
              disabled={!filters.permanence?.isSelected}
              name="permanence_end"
              value={filters.permanence?.value?.end || []}
              type="number"
              handleChange={onChangeHandler}
              error={formErrors.permanence}
              className={classes.formPermanenceInput}
              endAdornment={'min'}
              placeholder={'0'}
            ></Input>
          </div>
        </div>
      </div>

      {/* ================================= DATES CONTAINER =========================================== */}
      <div className={classes.datesContainer}>
        <div className={classes.dateContainer}>
          <div className={classes.checkboxLabelContainer}>
            <CheckBox
              name="in_time_selected"
              checked={!!filters.in_time?.isSelected}
              onChange={onChangeHandler}
            />
            <Label textLabel="Hora de Ingreso:" />
          </div>

          <div className={classes.dateInputsContainer}>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Inicio" />
              <Input
                disabled={!filters.in_time?.isSelected}
                className={classes.formInput}
                name="in_time_start_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.in_time?.value?.start_date}
                maxDate={filters.in_time?.value?.end_date}
                handleChange={onChangeHandler}
                error={formErrors.in_time_start_date}
              />
              <Input
                disabled={!filters.in_time?.isSelected}
                className={classes.formTimeInput}
                name="in_time_start_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.in_time?.value?.start_time}
                handleChange={onChangeHandler}
                error={formErrors.in_time_start_time}
              />
            </div>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Termino" />
              <Input
                disabled={!filters.in_time?.isSelected}
                className={classes.formInput}
                name="in_time_end_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.in_time?.value?.end_date}
                maxDate={new Date().toJSON().slice(0, 10)}
                handleChange={onChangeHandler}
                error={formErrors.trigger_timestamp_end_alert}
              />
              <Input
                disabled={!filters.in_time?.isSelected}
                className={classes.formTimeInput}
                name="in_time_end_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.in_time?.value?.end_time}
                handleChange={onChangeHandler}
                error={formErrors.in_time_end_time}
              />
            </div>
          </div>
          <div className={classes.dateButtonsContainer}>
            <Button
              disabled={!filters.in_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousHour(), 'in_time')}
            >
              Última hora
            </Button>
            <Button
              disabled={!filters.in_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousDay(), 'in_time')}
            >
              Último día
            </Button>
            <Button
              disabled={!filters.in_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousWeek(), 'in_time')}
            >
              Última semana
            </Button>
            <Button
              disabled={!filters.in_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousMonth(), 'in_time')}
            >
              Último mes
            </Button>
          </div>
        </div>
        <div className={classes.dateContainer}>
          <div className={classes.checkboxLabelContainer}>
            <CheckBox
              name="out_time_selected"
              checked={!!filters.out_time?.isSelected}
              onChange={onChangeHandler}
            />
            <Label textLabel="Hora de Egreso:" />
          </div>
          <div className={classes.dateInputsContainer}>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Inicio" />
              <Input
                disabled={!filters.out_time?.isSelected}
                className={classes.formInput}
                name="out_time_start_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.out_time?.value?.start_date}
                maxDate={filters.out_time?.value?.end_date}
                handleChange={onChangeHandler}
                error={formErrors.out_time_start_date}
              />
              <Input
                disabled={!filters.out_time?.isSelected}
                className={classes.formTimeInput}
                name="out_time_start_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.out_time?.value?.start_time}
                handleChange={onChangeHandler}
                error={formErrors.out_time_start_time}
              />
            </div>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Termino" />
              <Input
                disabled={!filters.out_time?.isSelected}
                className={classes.formInput}
                name="out_time_end_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.out_time?.value?.end_date}
                maxDate={new Date().toJSON().slice(0, 10)}
                handleChange={onChangeHandler}
                error={formErrors.close_timestamp_end_alert}
              />
              <Input
                disabled={!filters.out_time?.isSelected}
                className={classes.formTimeInput}
                name="out_time_end_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.out_time?.value?.end_time}
                handleChange={onChangeHandler}
                error={formErrors.out_time_end_time}
              />
            </div>
          </div>
          <div className={classes.dateButtonsContainer}>
            <Button
              disabled={!filters.out_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousHour(), 'out_time')}
            >
              Última hora
            </Button>
            <Button
              disabled={!filters.out_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousDay(), 'out_time')}
            >
              Último día
            </Button>
            <Button
              disabled={!filters.out_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousWeek(), 'out_time')}
            >
              {'Última\nsemana'}
            </Button>
            <Button
              disabled={!filters.out_time?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() => onPredefinedDateRange(previousMonth(), 'out_time')}
            >
              Último mes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorsContainer: {
    display: 'flex',
    alignItems: 'space-around',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: theme.palette.common.blue,
    margin: '2rem 0rem',
    padding: '1rem 2rem',
  },
  datesContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // borderRadius: 8,
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: theme.palette.common.blue,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '45%',
    margin: '0rem 1rem',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: theme.palette.common.blue,
  },
  dateInputsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInput: {
    display: 'flex',
    padding: '0rem 1rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dateButtonsContainer: {
    display: 'flex',
    padding: '1rem 1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalButtons: {
    margin: '0rem 0.2rem',
  },
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '1rem 0rem',
  },
  checkboxLabelContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: '0.7rem',
  },
  formInput: {
    width: '13rem',
  },
  formPermanenceInput: {
    width: '6rem',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: theme.palette.common.blue,
  },
  permanenceSeparator: {
    margin: '0rem 0.2rem',
  },
  formTimeInput: {
    marginTop: '0.2rem',
    width: '13rem',
  },
  formColumn: {
    marginRight: '1rem',
  },
}));

export default ZoneHistoryFiltersForm;
