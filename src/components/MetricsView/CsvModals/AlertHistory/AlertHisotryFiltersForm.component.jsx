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

const AlertHistoryFiltersForm = ({
  filters,
  onChangeHandler,
  formErrors,
  tagsList,
  batchesList,
  zonesList,
  usersList,
  connectorsList,
  alertTypes,
  onPredefinedDateRange,
}) => {
  const classes = useStyles();

  console.log(filters);

  const binOptions = tagsList
    .filter((tag) => !!tag.container)
    .map((typeItem) => ({
      label: typeItem.container,
      value: typeItem.container,
    }));

  const macOptions1 = tagsList.map((typeItem) => ({
    label: typeItem.address,
    value: typeItem.address,
  }));

  const macOptions2 = connectorsList.map((typeItem) => ({
    label: typeItem.mac,
    value: typeItem.mac,
  }));

  const macOptions = macOptions1.concat(macOptions2);

  const batchOptions = batchesList.map((typeItem) => ({
    label: typeItem.name,
    value: typeItem.name,
  }));

  const userOptions = usersList.map((typeItem) => ({
    label: typeItem.username,
    value: typeItem.username,
  }));

  const zoneOptions = zonesList.map((typeItem) => ({
    label: typeItem.name,
    value: typeItem.name,
  }));

  const alertTypeOptions = Object.entries(alertTypes.current).map(
    ([alertTypeKey, alertTypeLabel]) => ({
      label: alertTypeLabel,
      value: alertTypeKey,
    })
  );

  return (
    <div className={classes.container}>
      <div className={classes.selectorsContainer}>
        <div>
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="bin_selected"
                checked={!!filters.bin?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Bin:" />
            </div>
            <Select
              disabled={!filters.bin?.isSelected}
              name="bin"
              options={binOptions}
              value={filters.bin?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.bin}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione bins'}</p>;
                }
                if (selected.length === binOptions.length) {
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
                name="type_selected"
                checked={!!filters.type?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Alerta:" />
            </div>
            <Select
              disabled={!filters.type?.isSelected}
              name="type"
              options={alertTypeOptions}
              value={filters.type?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.types}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione tipos'}</p>;
                }
                if (selected.length === alertTypeOptions.length) {
                  return <p>{'Todos los tipos'}</p>;
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
          <div className={classes.formItem}>
            <div className={classes.checkboxLabelContainer}>
              <CheckBox
                name="user_selected"
                checked={!!filters.user?.isSelected}
                onChange={onChangeHandler}
              />
              <Label textLabel="Usuario:" />
            </div>
            <Select
              disabled={!filters.user?.isSelected}
              name="user"
              options={userOptions}
              value={filters.user?.value || []}
              handleChange={onChangeHandler}
              error={formErrors.user}
              className={classes.formInput}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Seleccione usuarios'}</p>;
                }
                if (selected.length === userOptions.length) {
                  return <p>{'Todos los usuarios'}</p>;
                }

                return selected.join(', ');
              }}
              // MenuProps={MenuProps}
            />
          </div>
        </div>
      </div>

      {/* ================================= DATES CONTAINER =========================================== */}
      <div className={classes.datesContainer}>
        <div className={classes.dateContainer}>
          <div className={classes.checkboxLabelContainer}>
            <CheckBox
              name="alert_trigger_timestamp_selected"
              checked={!!filters.alert_trigger_timestamp?.isSelected}
              onChange={onChangeHandler}
            />
            <Label textLabel="Hora de Alerta:" />
          </div>

          <div className={classes.dateInputsContainer}>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Inicio" />
              <Input
                disabled={!filters.alert_trigger_timestamp?.isSelected}
                className={classes.formInput}
                name="alert_trigger_timestamp_start_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.alert_trigger_timestamp?.value?.start_date}
                maxDate={filters.alert_trigger_timestamp?.value?.end_date}
                handleChange={onChangeHandler}
                error={formErrors.alert_trigger_timestamp_start_date}
              />
              <Input
                disabled={!filters.alert_trigger_timestamp?.isSelected}
                className={classes.formTimeInput}
                name="alert_trigger_timestamp_start_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.alert_trigger_timestamp?.value?.start_time}
                handleChange={onChangeHandler}
                error={formErrors.alert_trigger_timestamp_start_time}
              />
            </div>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Termino" />
              <Input
                disabled={!filters.alert_trigger_timestamp?.isSelected}
                className={classes.formInput}
                name="alert_trigger_timestamp_end_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.alert_trigger_timestamp?.value?.end_date}
                maxDate={new Date().toJSON().slice(0, 10)}
                handleChange={onChangeHandler}
                error={formErrors.trigger_timestamp_end_alert}
              />
              <Input
                disabled={!filters.alert_trigger_timestamp?.isSelected}
                className={classes.formTimeInput}
                name="alert_trigger_timestamp_end_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.alert_trigger_timestamp?.value?.end_time}
                handleChange={onChangeHandler}
                error={formErrors.alert_trigger_timestamp_end_time}
              />
            </div>
          </div>
          <div className={classes.dateButtonsContainer}>
            <Button
              disabled={!filters.alert_trigger_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousHour(), 'alert_trigger_timestamp')
              }
            >
              Última hora
            </Button>
            <Button
              disabled={!filters.alert_trigger_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousDay(), 'alert_trigger_timestamp')
              }
            >
              Último día
            </Button>
            <Button
              disabled={!filters.alert_trigger_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousWeek(), 'alert_trigger_timestamp')
              }
            >
              Última semana
            </Button>
            <Button
              disabled={!filters.alert_trigger_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(
                  previousMonth(),
                  'alert_trigger_timestamp'
                )
              }
            >
              Último mes
            </Button>
          </div>
        </div>
        <div className={classes.dateContainer}>
          <div className={classes.checkboxLabelContainer}>
            <CheckBox
              name="alert_close_timestamp_selected"
              checked={!!filters.alert_close_timestamp?.isSelected}
              onChange={onChangeHandler}
            />
            <Label textLabel="Hora de Aceptación:" />
          </div>
          <div className={classes.dateInputsContainer}>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Inicio" />
              <Input
                disabled={!filters.alert_close_timestamp?.isSelected}
                className={classes.formInput}
                name="alert_close_timestamp_start_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.alert_close_timestamp?.value?.start_date}
                maxDate={filters.alert_close_timestamp?.value?.end_date}
                handleChange={onChangeHandler}
                error={formErrors.alert_close_timestamp_start_date}
              />
              <Input
                disabled={!filters.alert_close_timestamp?.isSelected}
                className={classes.formTimeInput}
                name="alert_close_timestamp_start_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.alert_close_timestamp?.value?.start_time}
                handleChange={onChangeHandler}
                error={formErrors.alert_close_timestamp_start_time}
              />
            </div>
            <div className={classes.dateInput}>
              <Label textLabel="Fecha Termino" />
              <Input
                disabled={!filters.alert_close_timestamp?.isSelected}
                className={classes.formInput}
                name="alert_close_timestamp_end_date"
                placeholder="Hora de Alerta"
                type="date"
                value={filters.alert_close_timestamp?.value?.end_date}
                maxDate={new Date().toJSON().slice(0, 10)}
                handleChange={onChangeHandler}
                error={formErrors.close_timestamp_end_alert}
              />
              <Input
                disabled={!filters.alert_close_timestamp?.isSelected}
                className={classes.formTimeInput}
                name="alert_close_timestamp_end_time"
                placeholder="Hora de Alerta"
                type="time"
                value={filters.alert_close_timestamp?.value?.end_time}
                handleChange={onChangeHandler}
                error={formErrors.alert_close_timestamp_end_time}
              />
            </div>
          </div>
          <div className={classes.dateButtonsContainer}>
            <Button
              disabled={!filters.alert_close_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousHour(), 'alert_close_timestamp')
              }
            >
              Última hora
            </Button>
            <Button
              disabled={!filters.alert_close_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousDay(), 'alert_close_timestamp')
              }
            >
              Último día
            </Button>
            <Button
              disabled={!filters.alert_close_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousWeek(), 'alert_close_timestamp')
              }
            >
              {'Última\nsemana'}
            </Button>
            <Button
              disabled={!filters.alert_close_timestamp?.isSelected}
              className={classes.modalButtons}
              color="blue"
              onClick={() =>
                onPredefinedDateRange(previousMonth(), 'alert_close_timestamp')
              }
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
  formTimeInput: {
    marginTop: '0.2rem',
    width: '13rem',
  },
  formColumn: {
    marginRight: '1rem',
  },
}));

export default AlertHistoryFiltersForm;
