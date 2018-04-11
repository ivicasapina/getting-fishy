import './css/style.css';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './components/App';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';

// samo za github pages
const repo = window.location.pathname;

const Root = () => {
  return (
    <BrowserRouter basename={repo}>
      <Switch>
        <Route path="/" component={StorePicker} exact />
        <Route path="/store/:storeId" component={App} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

render(<Root />, document.querySelector('#main'));