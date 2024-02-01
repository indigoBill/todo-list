import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT } from '../barrel.js';
import './content.css';

const content = function(){

    const content = document.querySelector('.content');

    const rect = document.createElement('div');

    rect.classList.add('rect');

    content.appendChild(rect);

};

PubSub.subscribe(GENERAL_LAYOUT, content);