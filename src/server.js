import http from 'http';
import path from 'path';

// Express
import Express from 'express';
// import favicon from 'serve-favicon';
// import { trigger } from 'redial';

// React
import React from 'react';
import ReactDOM from 'react-dom/server';
import match from 'react-router/lib/match';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
// import RouterContext from 'react-router/lib/RouterContext';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';


// app deps
import configureStore from './store';
import Html from './components/Html';
import getRoutes from './routes';

const debug = require('debug')('boldr:server');

const port = parseInt(process.env.SSR_PORT, 10);

const app = new Express();
const server = http.createServer(app);
// app.use(favicon(path.resolve(process.cwd(), './static/favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', 'static')));

app.get('*', (req, res) => {
  if (__DEV__) {
    webpackIsomorphicTools.refresh();
  }

  const memoryHistory = createMemoryHistory(req.originalUrl);
  // const location = memoryHistory.createLocation(req.originalUrl);
  const store = configureStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send(`<!doctype html>
      ${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)} `);
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  const matchParams = {
    history,
    routes: getRoutes(store),
    location: req.originalUrl,
  };

  match(matchParams, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      // const { dispatch, getState } = store;

      // const locals = {
      //   path: renderProps.location.pathname,
      //   query: renderProps.location.query,
      //   params: renderProps.params,
      //   dispatch,
      //   getState
      // };

      // const { components } = renderProps;

      loadOnServer({ ...renderProps, store }).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        global.navigator = { userAgent: req.headers['user-agent'] };
        res.status(200).send('<!doctype html>\n' + // eslint-disable-line
          ReactDOM.renderToString(
            <Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />
          ));
      }).catch((mountError) => {
        debug(mountError.stack);
        return res.status(500);
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

server.listen(port, (err) => {
  if (err) {
    debug(err);
    return;
  }
  console.log(`🚀  Web server listening on ${port} in ${process.env.NODE_ENV} mode`);
});
