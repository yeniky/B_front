import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

const OrderInfo = ({ orderName, orderList }) => {
  const classes = useStyles();

  const [order, setOrder] = useState();

  useEffect(() => {
    setOrder(orderList.find((orderItem) => orderItem.name === orderName));
  }, [orderName, orderList]);

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="Material:" />
        <div className={classes.orderInfoContainer}>
          <Input
            className={classes.orderInfo1}
            placeholder={`${order && order.material ? order.material : ''}`}
            disabled
          />
          <Input
            className={classes.orderInfo2}
            placeholder={`${
              order && order.material_description
                ? order.material_description
                : ''
            }`}
            disabled
          />
        </div>
      </div>
      <div className={classes.formItem}>
        <Label textLabel="MG:" />
        <div className={classes.orderInfoContainer}>
          <Input
            className={classes.orderInfo1}
            placeholder={`${
              order && order.material_group ? order.material_group : ''
            }`}
            disabled
          />
          <Input
            className={classes.orderInfo2}
            placeholder={`${
              order && order.material_group_description
                ? order.material_group_description
                : ''
            }`}
            disabled
          />
        </div>
      </div>
      <div className={classes.formItem}>
        <Label textLabel="MPG:" />
        <div className={classes.orderInfoContainer}>
          <Input
            className={classes.orderInfo1}
            placeholder={`${
              order && order.material_pricing ? order.material_pricing : ''
            }`}
            disabled
          />
          <Input
            className={classes.orderInfo2}
            placeholder={`${
              order && order.material_pricing_description
                ? order.material_pricing_description
                : ''
            }`}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: '1.5rem',
  },
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  orderInfoContainer: {
    marginLeft: '0.7rem',
    display: 'flex',
  },
  orderInfo2: {
    width: '18rem',
    marginLeft: '0.5rem',
  },
}));

export default OrderInfo;
