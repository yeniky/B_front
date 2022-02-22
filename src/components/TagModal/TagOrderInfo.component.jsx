import React, { useState, useEffect } from 'react';

//Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { selectOrders } from "redux/Orders/orders.selectors";

//styles components
import { Typography } from '@material-ui/core';
import useStyles from 'components/TagModal/columns.styles';

// hooks
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const TagOrderInfo = ({ orderName }) => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);

  const pageInfo = usePagination(tagService.getOrders, 1, 1000);

  const { items: orderList } = pageInfo;

  useEffect(() => {
    const orderFound = orderList.find(
      (orderItem) => orderItem.name === orderName
    );
    setOrder(orderFound);
  }, [orderList, orderName]);

  return order ? (
    <div className={classes.container}>
      <Typography className={classes.title}>{'INFORMACIÓN'}</Typography>
      <Typography className={classes.label}>
        {'Orden: '}
        <span className={classes.info}>{order.name}</span>
      </Typography>
      <Typography className={classes.label}>
        {'Material: '}
        <span className={classes.info}>
          {order.material ? order.material : '---'}
        </span>
      </Typography>
      <Typography className={classes.label}>
        {'Material Desc: '}
        <span className={classes.info}>{order.material_description}</span>
      </Typography>
      <Typography className={classes.label}>
        {'MG: '}
        <span className={classes.info}>
          {order.material_group ? order.material_group : '---'}
        </span>
      </Typography>
      <Typography className={classes.label}>
        {'MG Desc: '}
        <span className={classes.info}>{order.material_group_description}</span>
      </Typography>
      <Typography className={classes.label}>
        {'MGP: '}
        <span className={classes.info}>
          {order.material_pricing ? order.material_pricing : '---'}
        </span>
      </Typography>
      <Typography className={classes.label}>
        {'MGP Desc: '}
        <span className={classes.info}>
          {order.material_pricing_description}
        </span>
      </Typography>
    </div>
  ) : null;
};

const mapStateToProps = createStructuredSelector({
  // orderList: selectOrders,
});

export default React.memo(connect(mapStateToProps)(TagOrderInfo));
