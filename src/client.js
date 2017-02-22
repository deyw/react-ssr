import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Router from 'react-router/lib/Router';
import match from 'react-router/lib/match';
import browserHistory from 'react-router/lib/browserHistory';

import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);
const mountNode = document.getElementById('content');

const renderApp = () => {
  const routes = require('./routes').default(store);

  // Sync routes both on client and server
  match({ routes, history }, () => {
    render(
      <AppContainer>
        <Provider store={store} key="provider">
          <Router
            history={history}
          >
            {routes}
          </Router>
        </Provider>
      </AppContainer>,
      mountNode
    );
  });
};

// Enable hot reload by react-hot-loader
if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {
      const RedBox = require('redbox-react').default;

      render(<RedBox error={error} />, mountNode);
    }
  };

  module.hot.accept('./routes', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      reRenderApp();
    });
  });
}

renderApp();
