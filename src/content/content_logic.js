import PubSub from 'pubsub-js';
import { EVENT_LISTENERS } from '../barrel.js';

export const SHOW_TASK_ADDER = 'display task adder';
export const CHECK_TASK_INPUTS = 'check that the required inputs have value';
export const TASK_ADDER_EVENT_LISTENER = 'add event listener to buttons in task adder container';
export const EXTEND_TASK = 'extend added task to view description and priority level';
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

function createExtendTaskIconEventListener(){
    const upDownIcon = document.querySelectorAll('.up-down-icon');

    //NODELIST INDEX WILL BE THE SAME SO FIGURE OUT A WAY TO USE THAT 
    //TO DETERMINE WHICH DISPLAY TO EXTEND

    upDownIcon.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            console.log(index);
            PubSub.publish(EXTEND_TASK, index);
        });
    });
}

function loadEventListeners(){
    createTaskAdderBtnEventListener();
}

function loadTaskAdderEventListeners(){
    createAddBtnEventListener();
    createCancelBtnEventListener();
}

function loadAddedTaskEventListener(){
    createExtendTaskIconEventListener();
}


PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);
PubSub.subscribe(ADDED_TASK_EVENT_LISTENER, loadAddedTaskEventListener);