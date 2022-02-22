import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import NavBatch from 'components/BatchView/NavBatch.component';
import TagTable from 'components/BatchView/TagTab.component';
import BatchTab from 'components/BatchView/BatchTab.component';
import MaterialTab from 'components/BatchView/MaterialTab.component';
import OrderTab from 'components/BatchView/OrderTab.component';
import MaterialGroupTab from 'components/BatchView/MaterialGroupTab.component';
import MaterialPriceGroupTab from 'components/BatchView/MaterialPriceGroupTab.component';
import UsersTab from 'components/BatchView/UsersTab.component';
import BeaconTab from 'components/BatchView/BeaconTab.component';

const BatchView = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('tags');
  return (
    <section>
      <NavBatch active={activeTab} setActive={setActiveTab} />
      <div className={classes.tabContainer}>
        {activeTab === 'tags' && <TagTable />}
        {activeTab === 'batchs' && <BatchTab />}
        {activeTab === 'materials' && <MaterialTab />}
        {activeTab === 'orders' && <OrderTab />}
        {activeTab === 'material_group' && <MaterialGroupTab />}
        {activeTab === 'material_price_group' && <MaterialPriceGroupTab />}
        {activeTab === 'beacons' && <BeaconTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  tabContainer: {
    width: '80%',
    margin: 'auto',
  },
}));

export default BatchView;
