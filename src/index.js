import 'react-app-polyfill/ie11';
import React from 'react';
import App from './App';
import { HashRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import ScrollToTop from './ScrollToTop';


const container = document.getElementById('app');
const root = createRoot(container); 

root.render(<HashRouter>
    <ScrollToTop>
    <App></App>
    </ScrollToTop>
    </HashRouter>);

