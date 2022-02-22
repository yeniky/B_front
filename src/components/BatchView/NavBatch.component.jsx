import React from 'react';

import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import NavButton from 'components/NavButton.component';
import { useSelector } from 'react-redux';

const NavBatch = ({ active, setActive }) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  return (
    <>
      <div className={classes.container}>
        <NavButton active={active === 'tags'} onClick={() => setActive('tags')}>
          {'Tag'}
        </NavButton>
        <NavButton
          active={active === 'batchs'}
          onClick={() => setActive('batchs')}
        >
          {'Batches'}
        </NavButton>
        <NavButton
          active={active === 'materials'}
          onClick={() => setActive('materials')}
        >
          {'MATERIALES'}
        </NavButton>
        <NavButton
          active={active === 'orders'}
          onClick={() => setActive('orders')}
        >
          {'Ordenes'}
        </NavButton>
        <NavButton
          active={active === 'material_group'}
          onClick={() => setActive('material_group')}
        >
          {'Material Group'}
        </NavButton>
        <NavButton
          active={active === 'material_price_group'}
          onClick={() => setActive('material_price_group')}
        >
          {'Material Price Group'}
        </NavButton>
        <NavButton
          active={active === 'beacons'}
          onClick={() => setActive('beacons')}
        >
          {'Balizas'}
        </NavButton>
        {user.role === 'Admin' && (
          <NavButton
            active={active === 'users'}
            onClick={() => setActive('users')}
          >
            {'Usuarios'}
          </NavButton>
        )}
      </div>
      <Divider className={classes.divider} />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '50%',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '1rem',
    margin: 'auto',
  },
  divider: {
    width: '80%',
    margin: 'auto',
    backgroundColor: theme.palette.common.blue,
    height: 2,
  },
}));

export default NavBatch;
