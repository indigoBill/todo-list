import PubSub from 'pubsub-js';
import { EVENT_LISTENERS } from '../barrel.js';

export const CREATE_TASK_ADDER = 'display task adder';
export const CHECK_TASK_INPUTS = 'check that the required inputs have value';
export const TASK_ADDER_EVENT_LISTENER = 'add event listener to buttons in task container';

function createAddTaskBtnEventListener(){
    const addTaskBtn = document.querySelector('.add-task-btn');

    addTaskBtn.addEventListener('click', () => {
        PubSub.publish(CREATE_TASK_ADDER);
    });
}

function createAddBtnEventListener(){
    const addBtn = document.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
        PubSub.publish(CHECK_TASK_INPUTS);
    });
}

function createCancelBtn(){

}

function loadEventListeners(){
    createAddTaskBtnEventListener();
}

PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, createAddBtnEventListener);