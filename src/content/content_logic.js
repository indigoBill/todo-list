import PubSub from 'pubsub-js';
import { format } from 'date-fns';

export const TASK_ADDER_EVENT_LISTENER = 'add event listeners to buttons in task adder container';


import { GENERAL_LAYOUT, EVENT_LISTENERS, taskAdder, content, task } from '../barrel.js';

const taskArr = [];

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

function toggleEditMode(...elements){
    for(const ele of elements){
        ele.classList.toggle('edit');
    }
}

function editTask(event){
    const currentTaskContainer = event.target.closest('.task-container');
    const taskInputContainer = currentTaskContainer.children[1];
    
    const addBtn = document.querySelector('.add-btn');

    toggleEditMode(addBtn, currentTaskContainer);

    for(const input of taskInputContainer.children){

        if(input.className === 'header-container'){
            getTaskAdderInput('title').value = input.textContent;
        }else if(input.className === 'task-date'){
            getTaskAdderInput('date').value = format(input.textContent, 'yyyy-MM-dd');
        }else if(input.className === 'task-description'){
            getTaskAdderInput('description').value = input.textContent;
        }else if(input.className === 'priority'){
            getTaskAdderInput('priority').value = input.textContent;
        }
    }

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
    }
}

function updateTask(requiredInputs){
    const edittedTaskContainer = document.querySelector('.task-container.edit');

    const addBtn = document.querySelector('.add-btn');

    if(requiredInputs){

        for(const input of edittedTaskContainer.children){

            if(input.className === 'header-container'){
                input.textContent = getTaskAdderInput('title').value;
            }else if(input.className === 'task-date'){
                input.textContent = format(getTaskAdderInput('date').value, 'MM-dd-yyyy');
            }else if(input.className === 'task-description'){
                input.textContent = getTaskAdderInput('description').value;
            }else if(input.className === 'priority'){
                input.textContent = getTaskAdderInput('priority').value;
            }
        }
    }

    toggleEditMode(addBtn, edittedTaskContainer);
}

function removeTaskFromPage(event){
    const currentTaskContainer = event.target.closest('.task-container');

    let currentIndex = currentTaskContainer.getAttribute('task-index');

    taskArr.forEach((taskObj) => {
        let objIndex = taskObj.attributes[1].nodeValue;

        if(objIndex === currentIndex){
            taskArr.splice(currentIndex, 1);
        }
    });

    currentTaskContainer.remove();
    updateDataIndexAttribute();
}

function toggleTaskObjDisplay(event){
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

export function createTaskEventListeners(){
    const upDownIcon = document.querySelectorAll('.up-down-icon');
    const garbageIcon = document.querySelectorAll('.garbage-icon');
    const deleteBtn = document.querySelectorAll('.delete-btn');
    const editIcon = document.querySelectorAll('.edit-icon');

    upDownIcon.forEach((icon) => {
        icon.addEventListener('click', toggleTaskObjDisplay);
    });

    garbageIcon.forEach((icon) => {
        icon.addEventListener('click', toggleDeleteBtn);
    });

    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', removeTaskFromPage);
    });

    // editIcon.forEach((icon) => {
    //     icon.addEventListener('click', editTask);
    // });
}


function createAddBtnEventListener(){
    const addBtn = document.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
        // if(addBtn.classList.contains('edit')){
        //     updateTask(checkRequiredInputValues());
        // }else{
        //     addTaskToPage(checkRequiredInputValues());
        // }

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
        togglePageDisplay();
    });
}

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(GENERAL_LAYOUT, taskAdder.createTaskAdder);
PubSub.subscribe(EVENT_LISTENERS, createAddTaskBtnEventListener);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);

