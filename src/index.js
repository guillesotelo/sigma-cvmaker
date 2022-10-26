import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import store from './store'
import App from './App';
import './index.css';

ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Provider>,
  document.getElementById('root')
);

reportWebVitals();
