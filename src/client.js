import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Router from 'react-router/lib/Router';
import match from 'react-router/lib/match';
import browserHistory from 'react-router/lib/browserHistory';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import { syncHistoryWithStore } from 'react-router-redux';
import { trigger } from 'redial';

import ReactHotLoader from './components/ReactHotLoader';
import getRoutes from './routes';
import configureStore from './store';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);
const mountNode = document.getElementById('content');

const renderApp = () => {
  const routes = require('./routes').default(store);

  // Sync routes both on client and server
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
      <AppContainer>
        <Provider store={store}>
          <Router {...renderProps} />
        </Provider>
      </AppContainer>,
      mountNode,
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