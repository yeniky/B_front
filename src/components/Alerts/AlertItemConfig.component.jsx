import React, { useState } from 'react';

//redux
import { connect, useSelector } from 'react-redux';

import { deleteRule } from 'redux/Rules/rules.actions';

//styles components
import { Typography, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//components
import IconButton from 'components/IconButton.component';

import userService from 'services/users';
import { subscribe, unsubscribe } from 'redux/Users/user.actions';

const AlertItem = ({
  data,
  type,
  onDeleteRule,
  onEditRule,
  selectedId,
  subscribe,
  unsubscribe,
}) => {
  const user = useSelector((state) => state.user);

  const classes = useStyles({ user, type });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionModal, setSubscriptionModal] = useState({
    open: false,
    action: '',
    text: '',
  });

  const deleteHandler = () => {
    onDeleteRule(type, data.id);
    onEditRule({ id: -1 });
    setIsModalOpen(false);
  };

  const ruleClickHandler = () => {
    if (user.role === 'Admin') {
      onEditRule(data);
    }
  };

  const handleSubscribeClick = (subscribe) => {
    if (subscribe) {
      setSubscriptionModal({
        open: true,
        action: 'subscribe',
        text: '¿Desea suscribirse a esta alerta?',
      });
    } else {
      // unsubscribe
      setSubscriptionModal({
        open: true,
        action: 'unsubscribe',
        text: '¿Desea cancelar la suscripción a esta alerta?',
      });
    }
  };

  const handleSubscription = async () => {
    if (subscriptionModal.action === 'subscribe') {
      const res = await userService.subscribe(type, data.id);
      console.log({ type, id: data.id, res });
      setSubscriptionModal({ ...subscriptionModal, open: false });
      subscribe(type, data.id);
      return;
    }
    if (subscriptionModal.action === 'unsubscribe') {
      const res = await userService.unsubscribe(type, data.id);
      console.log({ type, id: data.id, res });
      setSubscriptionModal({ ...subscriptionModal, open: false });
      unsubscribe(type, data.id);
      return;
    }
  };

  return (
    <>
      <div className={classes.alertItem}>
        {type === 'zone' ? (
          <Typography
            className={`${classes.text} ${
              selectedId === data.id ? classes.textSelected : ''
            }`}
            onClick={ruleClickHandler}
          >
            {'Permanencia de '}
            <Typography
              className={classes.textData}
              component="span"
            >{`${data.time} minutos`}</Typography>
            {` en zona${data.zones.length > 1 ? 's' : ''} `}
            <Typography className={classes.textData} component="span">
              {data.zones.join(', ')}
            </Typography>
          </Typography>
        ) : null}
        {type === 'proximity' ? (
          <Typography
            className={`${classes.text} ${
              selectedId === data.id ? classes.textSelected : ''
            }`}
            onClick={ruleClickHandler}
          >
            {'Proximidad de '}
            <Typography
              className={classes.textData}
              component="span"
            >{`${data.distance} metro(s)`}</Typography>
            {' excepto en '}
            <Typography className={classes.textData} component="span">
              {data.zones.join(', ')}
            </Typography>
          </Typography>
        ) : null}
        {type === 'batch' ? (
          <Typography
            className={`${classes.text} ${
              selectedId === data.id ? classes.textSelected : ''
            }`}
            onClick={ruleClickHandler}
          >
            {'Separación de bins de '}
            <Typography className={classes.textData} component="span">
              {`${data.distance} metros`}
            </Typography>
            {' por '}
            <Typography className={classes.textData} component="span">
              {`${data.time} minutos`}
            </Typography>
          </Typography>
        ) : null}
        {type === 'cleanup' ? (
          <Typography className={`${classes.text}`}>
            {'Tag de limpieza '}
            <Typography className={classes.textData} component="span">
              {`${data.container} `}
            </Typography>
            {' en zona '}
            <Typography className={classes.textData} component="span">
              {`${data.zone} `}
            </Typography>
          </Typography>
        ) : null}
        {user.subscriptions[type + '_rules'].indexOf(data.id) < 0 ? (
          <IconButton
            subscribe
            onClick={() => handleSubscribeClick(true)}
            style={{ marginLeft: '1rem' }}
            helperText="Suscribirse"
          />
        ) : (
          <IconButton
            unsubscribe
            onClick={() => handleSubscribeClick(false)}
            style={{ marginLeft: '1rem' }}
            helperText="Cancelar suscripción"
          />
        )}
        {user && user.role === 'Admin' && type !== 'cleanup' && (
          <IconButton
            edit
            onClick={ruleClickHandler}
            style={{ marginLeft: '1rem' }}
          />
        )}
        {user && user.role === 'Admin' && type === 'zone' && (
          <IconButton
            remove
            onClick={() => setIsModalOpen(true)}
            style={{ marginLeft: '1rem' }}
          />
        )}
      </div>
      <Dialog open={isModalOpen} maxWidth={false}>
        <div className={classes.modalContainer}>
          <Typography className={classes.title} component="h1">
            {'¿Está seguro de borrar esta regla?'}
          </Typography>
          <div className={classes.buttonsModal}>
            <IconButton accept onClick={deleteHandler} />
            <IconButton cancel onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Dialog>
      <Dialog open={subscriptionModal.open} maxWidth={false}>
        <div className={classes.modalContainer}>
          <Typography className={classes.title} component="h1">
            {subscriptionModal.text}
          </Typography>
          <div className={classes.buttonsModal}>
            <IconButton accept onClick={handleSubscription} />
            <IconButton
              cancel
              onClick={() =>
                setSubscriptionModal({ ...subscriptionModal, open: false })
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles(() => ({
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 10,
  },
  text: {
    backgroundColor: 'lightGrey',
    borderRadius: 5,
    color: 'black',
    padding: '0.3rem',
    width: '100%',
    cursor: (props) =>
      props.type !== 'cleanup' && props.user.role === 'Admin'
        ? 'pointer'
        : 'auto',
  },
  textSelected: {
    backgroundColor: '#A0D781',
    borderColor: 'black',
    borderWidth: '2px',
    border: 'solid',
  },
  textData: {
    fontWeight: 800,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: '5rem',
  },
  title: {
    fontSize: '2rem',
  },
  buttonsModal: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '2rem',
  },
}));

const mapDispatchToProps = (dispatch) => ({
  onDeleteRule: (type, id) => dispatch(deleteRule(type, id)),
  subscribe: (alert_type, id) => dispatch(subscribe(alert_type, id)),
  unsubscribe: (alert_type, id) => dispatch(unsubscribe(alert_type, id)),
});

export default connect(null, mapDispatchToProps)(AlertItem);
