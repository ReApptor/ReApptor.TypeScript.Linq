import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

/* FA (Font Awesome Pro) */
import "./lib/fa/fa.ts";
/* Bootstrap 4 */
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
/* JQuery required by bootstrap */
import "jquery";
/* Popper.js required by bootstrap */
import "popper.js";
/* App styles */
import "./base.scss";

ReactDOM.render(<App />, document.getElementById("root"));