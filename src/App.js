import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import LoginView from "./components/Login";
import BatchView from "./components/BatchView";
import AlertView from "./components/AlertView/Alerts.container";
import MetricsView from "./components/MetricsView/Metrics.container";
import "./styles/main.css";
import tagService from "./services/tags";

const App = () => {
  const [tags, setTags] = useState([]);
  const [zones, setZones] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [bins, setBins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [displayTag, setDisplayTag] = useState(0);

  useEffect(() => {
    tagService.getAllTags().then((tags) => {
      setTags(tags);
    });
    tagService.getZones().then((zones) => {
      setZones(zones);
    });
    tagService.getBatchs().then((batchs) => {
      setBatchList(batchs);
    });
    tagService.getContainers().then((bins) => {
      setBins(bins);
    });
    tagService.getOrders().then((orders) => {
      setOrders(orders);
    });
  }, []);

  const sendNewBatch = (newBatch) => {
    tagService.createBatch(newBatch).then((batch) => {
      setBatchList(batchList.concat(batch));
      const updatedBins = JSON.parse(JSON.stringify(bins));
      newBatch.containers_id.forEach((id) => {
        updatedBins.forEach((b) => {
          if (b.id === id) {
            b.batch = newBatch.name;
          }
        });
      });
      setBins(updatedBins);
    });
  };

  const editBatch = (batch) => {
    tagService.editBatch(batch).then((editedBatch) => {
      let updatedBins = bins.map((b) =>
        b.batch === editedBatch.name ? { ...b, batch: "" } : b
      );
      batch.containers_id.forEach((id) => {
        updatedBins.forEach((b) => {
          if (b.id === id) {
            b.batch = editedBatch.name;
          }
        });
      });
      setBins(updatedBins);
      setBatchList(
        batchList.map((b) => (b.id === editedBatch.id ? editedBatch : b))
      );
    });
  };

  const removeBatchFromOrder = (batch) => {
    const modBatch = { ...batch, order: "" };
    tagService.editBatch(modBatch).then((editedBatch) => {
      setBatchList(
        batchList.map((b) => (b.id === editedBatch.id ? editedBatch : b))
      );
    });
  };

  return (
    <section className="main-container">
      <TopBar />
      <Switch>
        <Route
          path="/dashboard"
          component={() => (
            <Dashboard
              zones={zones}
              setZones={setZones}
              batchList={batchList}
              setBatchList={setBatchList}
              bins={bins}
              setBins={setBins}
            />
          )}
        />
        <Route
          path="/devices"
          component={() => (
            <BatchView
              tags={tags}
              batchs={batchList}
              bins={bins}
              orders={orders}
              sendNewBatch={sendNewBatch}
              editBatch={editBatch}
              removeBatchFromOrder={removeBatchFromOrder}
              displayTag={displayTag}
              setDisplayTag={setDisplayTag}
            />
          )}
        />
        <Route exact path="/" component={LoginView} />
        <Route exact path="/alerts" component={AlertView} />
        <Route exact path="/metrics" component={MetricsView} />
      </Switch>
    </section>
  );
};

export default App;
