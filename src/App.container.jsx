import React from "react";
import Router from "pages/router";

import { Provider } from "react-redux";
import { Store } from "redux/store";

const App = () => (
  <Provider store={Store}>
    <Router />
  </Provider>
);

export default App;
