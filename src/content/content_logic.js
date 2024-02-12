import PubSub from 'pubsub-js';

export const TASK_ADDER_EVENT_LISTENER = 'add event listeners to buttons in task adder container';


import { GENERAL_LAYOUT, EVENT_LISTENERS, taskAdder, content, task } from '../barrel.js';

const taskArr = [];

function addTaskToArray(taskObj){
    taskArr.push(taskObj);
}

function toggleTaskAdderDisplay(){
    const taskAdder = document.querySelector('.task-adder-container');

    taskAdder.classList.toggle('hide');
}

function clearTaskAdder(){
    const title = getTaskAdderInput('title');
    const date = getTaskAdderInput('date');
    const description = getTaskAdderInput('description');
    const priority = getTaskAdderInput('priority');

    const inputs = [title, date, description, priority];

    inputs.forEach((input) => {
        if(input.type.includes('select')){
            input.selectedIndex = 0; 
        }else {
            input.value = '';
        }
    });
}

export function getTaskAdderInput(inputName){
    let input;

    switch(inputName) {
        case 'title' :
            input = document.querySelector('#title');
            break;
        case 'date' :
            input = document.querySelector('#date');
            break;
        case 'description' :
            input = document.querySelector('#description');
            break;
        case 'priority' :
            input = document.querySelector('select');
            break;
    }

    return input;
}

function checkRequiredInputValues(){
    const titleNode = getTaskAdderInput('title');
    const dateNode = getTaskAdderInput('date');

    if(titleNode.value && dateNode.value){
        return true;
    }

    return false;
}

function resetPage(){
    clearTaskAdder();
    content.toggleAddTaskBtnDisplay();
    toggleTaskAdderDisplay();
}

function addTaskToPage(requiredInputs){
    if(requiredInputs){
        const taskObj = new task();
        const newTask = taskObj.createTask();
        
        addTaskToArray(newTask);
        resetPage();
    }
}

function toggleTaskObjDisplay(event){
    const taskContainer = document.querySelectorAll('.task-container');

    taskContainer.forEach((container) => {
        if(event.target.closest('.task-container') === container){
            container.classList.add('active-task');

            const descriptionNode = document.querySelector('.active-task .task-description');
            const priorityNode = document.querySelector('.active-task .task-priority');

            if(container.contains(descriptionNode)){
                descriptionNode.classList.toggle('hide');
            }
            
            if(container.contains(priorityNode)){
                priorityNode.classList.toggle('hide');
            }
        }else{
            container.classList.remove('active-task');
        }
    });
}

function removeAddedTask(event){
    const currentTaskContainer = event.target.closest('.task-container');

    currentTaskContainer.remove();
}

export function createAddedTaskEventListeners(){
    const upDownIcon = document.querySelectorAll('.up-down-icon');
    const garbageIcon = document.querySelectorAll('.garbage-icon');

    upDownIcon.forEach((icon) => {
        icon.addEventListener('click', toggleTaskObjDisplay);
    });

    garbageIcon.forEach((icon) => {
        icon.addEventListener('click', removeAddedTask);
    });
}












function createAddBtnEventListener(){
    const addBtn = document.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
        addTaskToPage(checkRequiredInputValues());
    });
}

function createCancelBtnEventListener(){
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
        resetPage();
    });
}

function loadTaskAdderEventListeners(){
    createAddBtnEventListener();
    createCancelBtnEventListener();
}

function createAddTaskBtnEventListener(){
    const addTaskBtn = document.querySelector('.add-task-btn');

    addTaskBtn.addEventListener('click', () => {
        resetPage();
    });
}

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(GENERAL_LAYOUT, taskAdder.createTaskAdder);
PubSub.subscribe(EVENT_LISTENERS, createAddTaskBtnEventListener);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);

