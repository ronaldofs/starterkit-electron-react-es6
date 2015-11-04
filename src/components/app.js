import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main/Main.js';

const remote = window.require('remote');

let container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<Main />, container);
