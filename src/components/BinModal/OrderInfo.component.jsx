import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

// hooks
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const OrderInfo = ({ orderName }) => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);

  const pageInfo = usePagination(tagService.getOrders, 1, 1000);

  const { items: orderList } = pageInfo;

  useEffect(() => {
    if (orderName) {
      const orderFound = orderList.find(
        (orderItem) => orderItem.name === orderName
      );
      setOrder(orderFound);
    }
  }, [orderList, orderName]);

  return (
    !!order && (
      <div className={classes.container}>
        <div className={classes.formItem}>
          <Label textLabel="Orden:" />
          <Input
            className={classes.formInput}
            placeholder={`${order.name ? order.name : '---'}`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Material:" />
          <Input
            className={classes.formInput}
            placeholder={`${order.material ? order.material : '---'}`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Material Desc:" />
          <Input
            className={classes.formInput}
            placeholder={`${
              order.material_description ? order.material_description : '---'
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MG:" />
          <Input
            className={classes.formInput}
            placeholder={`${
              order.material_group ? order.material_group : '---'
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MG Desc:" />
          <Input
            className={classes.formInput}
            placeholder={`${
              order.material_group_description
                ? order.material_group_description
                : '---'
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MPG:" />
          <Input
            className={classes.formInput}
            placeholder={`${
              order.material_pricing ? order.material_pricing : '---'
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MPG Desc:" />
          <Input
            className={classes.formInput}
            placeholder={`${
              order.material_pricing_description
                ? order.material_pricing_description
                : '---'
            }`}
            disabled
          />
        </div>
      </div>
    )
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
    marginBottom: '0.9rem',
  },
  formInput: {
    width: '18rem',
    marginLeft: '1rem',
  },
}));

export default OrderInfo;
