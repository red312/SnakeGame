/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import './styles/index.css'

const app = document.getElementById('app');


render(() => <App />, app!);
