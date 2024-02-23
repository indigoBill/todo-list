import { GENERAL_LAYOUT, EVENT_LISTENERS, LOAD_STORAGE_TASKS, LOAD_STORAGE_PROJECTS } from './barrel.js';
import PubSub from 'pubsub-js';

document.addEventListener('DOMContentLoaded', () => {
    PubSub.publish(GENERAL_LAYOUT);
    PubSub.publish(EVENT_LISTENERS);

    if(localStorage.getItem('allTasks')){
        PubSub.publish(LOAD_STORAGE_TASKS);
    }

    if(localStorage.getItem('allProjects')){
        PubSub.publish(LOAD_STORAGE_PROJECTS);
    }
});




