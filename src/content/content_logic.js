import PubSub from 'pubsub-js';
import { format, isToday, isThisWeek } from 'date-fns';

export const TASK_ADDER_EVENT_LISTENER = 'add event listeners to buttons in task adder container';
export const TASK_EVENT_LISTENER = 'add event listeners to buttons in each task';
export const PROJECT_DROPDOWN = 'update project dropdown list options as user adds projects';
export const PROJECT_ATTRIBUTE = 'remove specific project attribute from tasks if specific project is deleted';
export const CURRENT_TAB = 'display tasks of currently selected sidebar tab';
export const SEARCH_TASKS = 'filter tasks using the search bar';
export const LOAD_STORAGE_TASKS = 'load tasks from local storage';

import { GENERAL_LAYOUT, EVENT_LISTENERS, TASK_COUNT, DEFAULT_CURRENT_TAB, taskAdder, content, task } from '../barrel.js';

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
            input = document.querySelector('#priority-selections');
            break;
        case 'project' :
            input = document.querySelector('#project-selections');
            break;
    }

    return input;
}

function clearTaskAdder(){
    const title = getTaskAdderInput('title');
    const date = getTaskAdderInput('date');
    const description = getTaskAdderInput('description');
    const priority = getTaskAdderInput('priority');
    const project = getTaskAdderInput('project');

    const inputs = [title, date, description, priority, project];

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

    loadDomObjToStorage();
}

function removeEdittedTask(){
    const currentTaskContainer = getEdittedTaskObj();

    removeTask(currentTaskContainer);
}

function removeTaskFromPage(event){
    const currentTaskContainer = event.target.closest('.task-container');

    removeTask(currentTaskContainer);

    PubSub.publish(TASK_COUNT);
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
        }else if(input.className === 'task-project'){
            getTaskAdderInput('project').value = input.textContent;
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
        PubSub.publish(CURRENT_TAB);
    }
}

function addProjectOptionToDropDown(){
    const projectDropDown = getTaskAdderInput('project');
    const projects = document.querySelectorAll('.project-text');

    while(projectDropDown.childNodes.length > 1){
        projectDropDown.removeChild(projectDropDown.lastChild);
    }

    projects.forEach((project) => {
        const projectName = project.textContent;
        const projectOption = document.createElement('option');

        projectOption.textContent = projectName;
        projectDropDown.appendChild(projectOption);
    });  
}

//IF A PROJECT IS DELETED & TASKS WERE ASSIGNED TO THAT PROJECT WE HAVE TO RELOAD
//THE taskArr WITH THE NEWLY EDITTED TASKS W/O PROJECT ATTRIBUTES
//THIS KEEPS THE taskArr CONSISTENT WITH THE TASKS IN THE VIEWPORT
function reloadTaskArr(){
    taskArr.splice(0, taskArr.length);

    const totalTasks = document.querySelectorAll('.task-container');

    totalTasks.forEach((task) => {
        taskArr.push(task);
    });

    loadDomObjToStorage();
}

function removeProjectAttribute(){
    const tasksWithProjectAtt = document.querySelectorAll('[project]');
    const projectList = document.querySelectorAll('.project-text');
    const projectListArr = [];

    projectList.forEach((project) => {
        projectListArr.push(project.textContent);
    });

    tasksWithProjectAtt.forEach((task) => {
        const attributeValue = task.getAttribute('project');

        if(!(projectListArr.includes(attributeValue))){
            const userInputContainer = task.querySelector('.user-input-container');

            task.removeAttribute('project');
            userInputContainer.removeChild(userInputContainer.querySelector('.task-project'));

            reloadTaskArr();
            PubSub.publish(TASK_COUNT);
        }
    });
}

function extendTaskObjDisplay(event){
    const taskContainer = document.querySelectorAll('.task-container');

    taskContainer.forEach((container) => {
        if(event.target.closest('.task-container') === container){
            container.classList.add('active-task');

            const descriptionNode = document.querySelector('.active-task .task-description');
            const priorityNode = document.querySelector('.active-task .task-priority');
            const projectNode = document.querySelector('.active-task .task-project');
            const editIcon = document.querySelector('.active-task .edit-icon');

            if(container.contains(descriptionNode)){
                descriptionNode.classList.toggle('hide');
            }
            
            if(container.contains(priorityNode)){
                priorityNode.classList.toggle('hide');
            }

            if(container.contains(projectNode)){
                projectNode.classList.toggle('hide');
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

        loadDomObjToStorage();
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

function displayInboxTasks(){    
    const allTasks = document.querySelectorAll('.task-container');

    allTasks.forEach((task) => {
        if(task.getAttribute('project') !== null){
            task.classList.add('hide');
        }else{
            task.classList.remove('hide');
        }
    });
}

function displayTodayTasks(){    
    const allTasks = document.querySelectorAll('.task-container');

    allTasks.forEach((task) => {
        const taskDate = task.querySelector('.task-date');

        if(isToday(taskDate.textContent)){
            task.classList.remove('hide');
        }else{
            task.classList.add('hide');
        }
    });
}

function displayThisWeekTasks(){    
    const allTasks = document.querySelectorAll('.task-container');

    allTasks.forEach((task) => {
        const taskDate = task.querySelector('.task-date');

        if(isThisWeek(taskDate.textContent)){
            task.classList.remove('hide');
        }else{
            task.classList.add('hide');
        }
    });
}

function displayAnytimeTasks(){    
    const allTasks = document.querySelectorAll('.task-container');

    allTasks.forEach((task) => {
        task.classList.remove('hide');
    });
}

function displayProjectTasks(projectTitle){
    const allTasks = document.querySelectorAll('.task-container');

    allTasks.forEach((task) => {
        const taskBelongsToProject = task.getAttribute('project') === projectTitle;

        if(taskBelongsToProject){
            task.classList.remove('hide');
        }else{
            task.classList.add('hide');
        }
    });
}

function showCurrentTabContent(){
    const currentTab = document.querySelector('.current-tab');

    if(currentTab === null){
        PubSub.publish(DEFAULT_CURRENT_TAB);
        return;
    }

    if(currentTab.classList.contains('filter-option')){
        if(currentTab.classList.contains('inbox')){
            displayInboxTasks();
        }else if(currentTab.classList.contains('today')){
            displayTodayTasks();
        }else if(currentTab.classList.contains('this-week')){
            displayThisWeekTasks();
        }else if(currentTab.classList.contains('anytime')){
            displayAnytimeTasks();
        }
    }else{
        const projectName = currentTab.querySelector('.project-text').textContent;

        displayProjectTasks(projectName);
    }
}

function searchForTasks(){
    const currentPageTasksTitleContainers = document.querySelectorAll('.task-container:not(.hide) .task-title');
    let searchValue = document.querySelector('#search').value.toLowerCase();

    currentPageTasksTitleContainers.forEach((titleContainer) => {
        const taskTitle = titleContainer.textContent.toLowerCase();

        if(taskTitle.includes(searchValue)){
            titleContainer.closest('.task-container').classList.remove('search-hide');
        }else{
            titleContainer.closest('.task-container').classList.add('search-hide');
        }

        if(searchValue === ''){
            titleContainer.closest('.task-container').classList.remove('search-hide');
        }
    });
}

function loadDomObjToStorage(){    
    const stringTaskArr = [];

    taskArr.forEach((taskDomObj) => {
        const stringObj = taskDomObj.outerHTML;

        if(!(stringTaskArr.includes(stringObj))){
            stringTaskArr.push(stringObj);
        }
        
    });

    localStorage.setItem('allTasks', JSON.stringify(stringTaskArr));
}

function reloadTasksFromStorage(){
    const objTaskArr = JSON.parse(localStorage.getItem('allTasks'));
    const parser = new DOMParser();

    objTaskArr.forEach((stringObj) => {
        const newDoc = parser.parseFromString(stringObj, 'text/html');
        const domObj = newDoc.body.firstChild;

        addTaskToArray(domObj);
        document.querySelector('.content').appendChild(newDoc.body.firstChild);

        createTaskEventListeners();
        PubSub.publish(TASK_COUNT);
        PubSub.publish(CURRENT_TAB);
    });

}

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(GENERAL_LAYOUT, taskAdder.createTaskAdder);
PubSub.subscribe(EVENT_LISTENERS, createAddTaskBtnEventListener);
PubSub.subscribe(TASK_ADDER_EVENT_LISTENER, loadTaskAdderEventListeners);
PubSub.subscribe(TASK_EVENT_LISTENER, createTaskEventListeners);
PubSub.subscribe(PROJECT_DROPDOWN, addProjectOptionToDropDown);
PubSub.subscribe(PROJECT_ATTRIBUTE, removeProjectAttribute);
PubSub.subscribe(CURRENT_TAB, showCurrentTabContent);
PubSub.subscribe(SEARCH_TASKS, searchForTasks);
PubSub.subscribe(LOAD_STORAGE_TASKS, reloadTasksFromStorage);


