import { GENERAL_LAYOUT, EVENT_LISTENERS } from './barrel.js';
import PubSub from 'pubsub-js';

document.addEventListener('DOMContentLoaded', () => {
    PubSub.publish(GENERAL_LAYOUT);
    PubSub.publish(EVENT_LISTENERS);
});


