import PubSub from 'pubsub-js';
import { format } from 'date-fns';

export const TASK_ADDER_EVENT_LISTENER = 'add event listeners to buttons in task adder container';
export const TASK_EVENT_LISTENER = 'add event listeners to buttons in each task';

import { GENERAL_LAYOUT, EVENT_LISTENERS, TASK_COUNT, taskAdder, content, task } from '../barrel.js';

const taskArr = [];
let currentlyEditting = false;

function addTaskToArray(taskObj){
    taskArr.push(taskObj);
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

function getEdittedTaskObj(){
    const edittedObj = document.querySelector('.task-container.edit');

    return edittedObj;
}

function toggleEdittedTaskObjDisplay(){
    let task = getEdittedTaskObj();

    task.classList.toggle('hide');
}

function removeTask(taskObj){
    let currentIndex = taskObj.getAttribute('task-index');

    taskArr.forEach((obj) => {
        let objIndex = obj.attributes[1].nodeValue;

        if(objIndex === currentIndex){
            taskArr.splice(currentIndex, 1);
        }
    });

    taskObj.remove();
    updateDataIndexAttribute();
}

function removeEdittedTask(){
    const currentTaskContainer = getEdittedTaskObj();

    removeTask(currentTaskContainer);
}

function addEditClass(taskObj){
    const allTaskContainers = document.querySelectorAll('.task-container');

    allTaskContainers.forEach((container) => {
        container.classList.remove('edit');
    });

    taskObj.classList.add('edit');
}

function editTask(event){
    const currentTaskContainer = event.target.closest('.task-container');
    const taskInputContainer = currentTaskContainer.children[1];

    addEditClass(currentTaskContainer);
    
    for(const input of taskInputContainer.children){
        if(input.className === 'header-container'){
            getTaskAdderInput('title').value = input.textContent;
        }else if(input.className === 'task-date'){
            getTaskAdderInput('date').value = format(input.textContent, 'yyyy-MM-dd');
        }else if(input.className === 'task-description'){
            getTaskAdderInput('description').value = input.textContent;
        }else if(input.className === 'task-priority'){
            getTaskAdderInput('priority').value = input.textContent;
        }
    }

    currentlyEditting = true;
    toggleEdittedTaskObjDisplay();
    togglePageDisplay();
}

function checkRequiredInputValues(){
    const titleNode = getTaskAdderInput('title');
    const dateNode = getTaskAdderInput('date');

    if(titleNode.value && dateNode.value){
        return true;
    }

    return false;
}

function togglePageDisplay(){
    content.toggleAddTaskBtnDisplay();
    taskAdder.toggleTaskAdderDisplay();
}

function resetPage(){
    clearTaskAdder();
    togglePageDisplay();
}

function addDataIndexAttribute(obj, positionInArr){
    obj.setAttribute('task-index', `${positionInArr}`);
}

function updateDataIndexAttribute(){
    taskArr.forEach((taskObj, index) => {
        taskObj.setAttribute('task-index', `${index}`);
    });
}

function addTaskToPage(requiredInputs){
    if(requiredInputs){
        const taskObj = new task();
        const newTask = taskObj.createTask();
        
        addTaskToArray(newTask);
        addDataIndexAttribute(newTask, taskArr.length - 1);
        resetPage();

        PubSub.publish(TASK_COUNT);
    }
}

function removeTaskFromPage(event){
    const currentTaskContainer = event.target.closest('.task-container');

    removeTask(currentTaskContainer);

    PubSub.publish(TASK_COUNT);
}

function extendTaskObjDisplay(event){
    const taskContainer = document.querySelectorAll('.task-container');

    taskContainer.forEach((container) => {
        if(event.target.closest('.task-container') === container){
            container.classList.add('active-task');

            const descriptionNode = document.querySelector('.active-task .task-description');
            const priorityNode = document.querySelector('.active-task .task-priority');
            const editIcon = document.querySelector('.active-task .edit-icon');

            if(container.contains(descriptionNode)){
                descriptionNode.classList.toggle('hide');
            }
            
            if(container.contains(priorityNode)){
                priorityNode.classList.toggle('hide');
            }

            editIcon.classList.toggle('hide');
        }else{
            container.classList.remove('active-task');
        }
    });
}

function toggleDeleteBtn(event){
    const currentTaskContainer = event.target.closest('.task-container');
    
    const deleteBtn = currentTaskContainer.lastChild;

    deleteBtn.classList.toggle('reveal');
}

function completeTask(event){
    const currentTaskContainer = event.target.closest('.task-container');
    currentTaskContainer.classList.toggle('completed');
    event.target.classList.toggle('checked');
}

function createTaskEventListeners(){
    const upDownIcon = document.querySelectorAll('.up-down-icon');
    const garbageIcon = document.querySelectorAll('.garbage-icon');
    const deleteBtn = document.querySelectorAll('.delete-btn');
    const editIcon = document.querySelectorAll('.edit-icon');
    const checkBtn = document.querySelectorAll('.check-btn');

    upDownIcon.forEach((icon) => {
        icon.addEventListener('click', extendTaskObjDisplay);
    });

    garbageIcon.forEach((icon) => {
        icon.addEventListener('click', toggleDeleteBtn);
    });

    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', removeTaskFromPage);
    });

    editIcon.forEach((icon) => {
        icon.addEventListener('click', editTask);
    });

    checkBtn.forEach((btn) => {
        btn.addEventListener('click', completeTask);
    });
}

function createAddBtnEventListener(){
    const addBtn = document.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
        addTaskToPage(checkRequiredInputValues());

        if(currentlyEditting){
            removeEdittedTask();
            currentlyEditting = false;
        }
    });
}

function createCancelBtnEventListener(){
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
        if(currentlyEditting){
            toggleEdittedTaskObjDisplay();
            currentlyEditting = false;
        }

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
        togglePageDisplay();
    });
}

function showCurrentTabContent(){


}

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(GENERAL_LAYOUT, taskAdder.createTaskAdder);
PubSub.subscribe(EVENT_LISTENERS, createAddTaskBtnEventListener);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);
PubSub.subscribe(TASK_EVENT_LISTENER, createTaskEventListeners);

