import { GENERAL_LAYOUT } from './barrel.js';
import PubSub from 'pubsub-js';

document.addEventListener('DOMContentLoaded', () => {
    PubSub.publish(GENERAL_LAYOUT);
});



