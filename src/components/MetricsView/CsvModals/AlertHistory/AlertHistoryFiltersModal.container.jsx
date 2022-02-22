import React, { useState } from 'react';
import useSWR from 'swr';

//redux
import { useSelector } from 'react-redux';

//style components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Form from 'components/MetricsView/CsvModals/AlertHistory/AlertHisotryFiltersForm.component.jsx';
import Button from 'components/Button.component';
import { selectTags } from 'redux/Tags/tags.selectors';
import { selectBatchs } from 'redux/Batchs/batch.selectors';
import { selectZones } from 'redux/Zones/zones.selectors';

//services
import userService from 'services/users';
import tagService from 'services/tags';
import moment from 'moment';
import { dateToLocalDateTime, splitDate } from 'utils/dates';

const today = dateToLocalDateTime(new Date());
const todayDateValue = {
  start_date: today.date,
  start_time: today.time,
  end_date: today.date,
  end_time: today.time,
};

const initialState = {
  alert_trigger_timestamp: {
    value: {
      ...todayDateValue,
    },
  },
  alert_close_timestamp: {
    value: {
      ...todayDateValue,
    },
  },
};

// const utcOffset = moment().utcOffset();

const AlertHistoryFilterModal = ({
  open,
  onCloseModal,
  onConfirmDownload,
  onErrors,
  alertTypes,
}) => {
  const classes = useStyles();

  const [filters, setFilters] = useState(initialState);

  const { data } = useSWR('users_alert_history', () =>
    userService.getUserList(1, 1000, '', 'asc', true)
  );

  const { data: connectors } = useSWR('connectors', () =>
    tagService.getConnectors()
  );

  console.log('CONNECTORS: ', connectors);

  // console.log('\n\n\nDATES');
  // console.log(
  //   `${filters.alert_trigger_timestamp.value.end_date}T${filters.alert_trigger_timestamp.value.end_time}`
  // );
  // console.log(utcOffset);
  // console.log(
  //   new Date(
  //     `${filters.alert_trigger_timestamp.value.end_date}T${filters.alert_trigger_timestamp.value.end_time}`
  //   ).toISOString()
  // );
  // console.log(
  //   moment(
  //     `${filters.alert_trigger_timestamp.value.end_date}T${filters.alert_trigger_timestamp.value.end_time}`
  //   )
  //     .utcOffset(utcOffset)
  //     .format('YYYY-MM-DD HH:mm:ss')
  // );
  // console.log('END_DATES\n\n\n');

  const setPredefinedDateRange = (previousDate, timestamp_type) => {
    if (
      timestamp_type !== 'alert_trigger_timestamp' &&
      timestamp_type !== 'alert_close_timestamp'
    ) {
      throw 'Invalid timestamp type';
    }
    const { date: prevDate, time: prevTime } = splitDate(previousDate);
    const { date, time } = splitDate(new Date());

    const value = {
      start_date: prevDate,
      end_date: date,
      start_time: prevTime,
      end_time: time,
    };

    setFilters({
      ...filters,
      [timestamp_type]: {
        ...filters[timestamp_type],
        value: value,
      },
    });
  };

  const tags = useSelector(selectTags);
  const batches = useSelector(selectBatchs);
  const zones = useSelector(selectZones);

  const handleFormChange = (event) => {
    const { value, name } = event.target;

    if (name.endsWith('_selected')) {
      const field_name = name.replace('_selected', '');
      setFilters({
        ...filters,
        [field_name]: {
          ...filters[field_name],
          isSelected: !!event.target.checked,
        },
      });
    } else if (name.endsWith('_date') || name.endsWith('_time')) {
      const splitted = name.split('_');
      const field_name = splitted.slice(0, splitted.length - 2).join('_');
      const sub_field_name = splitted.slice(splitted.length - 2).join('_');
      setFilters({
        ...filters,
        [field_name]: {
          ...filters[field_name],
          value: {
            ...filters[field_name].value,
            [sub_field_name]: value,
          },
        },
      });
    } else setFilters({ ...filters, [name]: { ...filters[name], value } });
  };

  const handleCloseModal = () => {
    setFilters(initialState);
    onCloseModal();
  };

  return (
    <Dialog open={open} maxWidth={false}>
      {open && (
        <div className={classes.container}>
          <div className={classes.headerContainer}>
            <Title title={`Filtros`} Icon={CheckBoxOutlineBlank} />
            <Button
              className={classes.resetButton}
              color="blue"
              onClick={() => setFilters(initialState)}
            >
              Limpiar Filtros
            </Button>
          </div>
          <div className={classes.formContainer}>
            <Form
              filters={filters}
              onChangeHandler={handleFormChange}
              formErrors={onErrors}
              tagsList={tags}
              batchesList={batches}
              usersList={data?.items || []}
              connectorsList={connectors || []}
              alertTypes={alertTypes}
              zonesList={zones}
              onPredefinedDateRange={setPredefinedDateRange}
            />
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              className={classes.modalButtons}
              color="green"
              onClick={() => onConfirmDownload(filters)}
            >
              Descargar
            </Button>

            <Button
              className={classes.modalButtons}
              color="red"
              onClick={() => handleCloseModal()}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* <ConfirmModal
        open={isDeactivating}
        title="¿Desea desactivar esta orden?"
        onConfirm={() => {
          onChangeStatus(editedOrder.id, !editedOrder.active);
          setDeactivating(false);
          closeModal();
        }}
        onCancel={() => setDeactivating(false)}
      /> */}
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '2rem',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formContainer: {
    display: 'flex',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '2rem',
  },
  modalButtons: {
    fontSize: '1rem',
    paddingLeft: '3rem',
    paddingRight: '3rem',
  },
  resetButton: {
    margin: '1rem',
  },
}));

export default AlertHistoryFilterModal;
