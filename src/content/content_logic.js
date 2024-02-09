import PubSub from 'pubsub-js';
import { EVENT_LISTENERS } from '../barrel.js';

export const SHOW_TASK_ADDER = 'display task adder';
export const CHECK_TASK_INPUTS = 'check that the required inputs have value';
export const TASK_ADDER_EVENT_LISTENER = 'add event listener to buttons in task adder container';
export const ADDED_TASK_EVENT_LISTENER = 'add event listener to icons in added tasks';

function createTaskAdderBtnEventListener(){
    const addTaskBtn = document.querySelector('.add-task-btn');

    addTaskBtn.addEventListener('click', () => {
        PubSub.publish(SHOW_TASK_ADDER);
    });
}

function createAddBtnEventListener(){
    const addBtn = document.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
        PubSub.publish(CHECK_TASK_INPUTS);
    });
}

function createCancelBtnEventListener(){
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
        PubSub.publish(SHOW_TASK_ADDER);
    });
}

function loadEventListeners(){
    createTaskAdderBtnEventListener();
}

function loadTaskAdderEventListeners(){
    createAddBtnEventListener();
    createCancelBtnEventListener();
}

PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);
