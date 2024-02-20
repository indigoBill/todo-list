import PubSub from "pubsub-js";
import { GENERAL_LAYOUT, SIDEBAR_DISPLAY, PROJECT_DROPDOWN, PROJECT_ATTRIBUTE, CURRENT_TAB, createProjectDiv } from '../barrel.js';
import { isToday, isThisWeek } from 'date-fns';

export const TASK_COUNT = 'update the task counters in the sidebar';
export const DEFAULT_CURRENT_TAB = 'set the inbox tab to be the default current tab';

const projectNamesArr = [];

function revealSideBar(){
    const sideBar = document.querySelector('.side-bar');
    const mediaQuery = window.matchMedia('(max-width: 560px)');

    if(mediaQuery.matches){
        sideBar.classList.toggle('side-bar-cover');
        sideBar.classList.remove('side-bar-push');
    }else{
        sideBar.classList.toggle('side-bar-push');
        sideBar.classList.remove('side-bar-cover');
    }
}

function removeCurrentTab(){
    const currentTabs = document.querySelectorAll('.current-tab');

    currentTabs.forEach((tab) => {
        tab.classList.toggle('current-tab');
    });
}

function selectCurrentTab(event){
    event.currentTarget.classList.toggle('current-tab');
}

function setDefaultCurrentTab(){
    const defaultTab = document.querySelector('.inbox');

    defaultTab.classList.add('current-tab');

    PubSub.publish(CURRENT_TAB);
}

function addSideBarEventListeners(){
    const filterOptions = document.querySelectorAll('.filter-option');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const projectInput = document.querySelector('.project-input');

    filterOptions.forEach((element) => {
        element.addEventListener('click', (event) => {
            removeCurrentTab();
            selectCurrentTab(event);

            PubSub.publish(CURRENT_TAB);
        });
    });

    addProjectBtn.addEventListener('click', toggleProjectInputDisplay);

    projectInput.addEventListener('keydown', addProject);
}

function getAllTasks(){
    const allTasks = document.querySelectorAll('[task-index]');

    return allTasks;
}

function updateInboxTab(){
    //IF TASK DOESNT HAVE A PROJECT ATTRIBUTE ITLL COUNT TO THE INBOX TAB
    const inboxTaskCounter = document.querySelector('.inbox > div:last-child');
    const tasksWithoutProject = document.querySelectorAll('.content > div:nth-child(n + 3):not(.task-container[project])');

    inboxTaskCounter.classList.add('task-count');

    if(tasksWithoutProject.length < 1){
        inboxTaskCounter.classList.remove('task-count');
        inboxTaskCounter.textContent = '';
    }else{
        inboxTaskCounter.textContent = tasksWithoutProject.length;
    }  
}

function updateTodayAndThisWeekTab(){
    const todayTaskCounter = document.querySelector('.today > div:last-child');    
    const thisWeekTaskCounter = document.querySelector('.this-week > div:last-child');
    const allTasks = getAllTasks();
    let tasksDueToday = 0;
    let tasksDueThisWeek = 0;

    allTasks.forEach((task) => {
        const taskDate = task.querySelector('.task-date');

        if(isToday(taskDate.textContent)){
            tasksDueToday++;
            todayTaskCounter.textContent = tasksDueToday;
        }

        if(isThisWeek(taskDate.textContent)){
            tasksDueThisWeek++;
            thisWeekTaskCounter.textContent = tasksDueThisWeek;
        }
    });

    todayTaskCounter.classList.add('task-count');
    thisWeekTaskCounter.classList.add('task-count');

    if(tasksDueToday < 1){
        todayTaskCounter.textContent = '';
        todayTaskCounter.classList.remove('task-count');
    }

    if(tasksDueThisWeek < 1){
        thisWeekTaskCounter.textContent = '';
        thisWeekTaskCounter.classList.remove('task-count');
    }
}

function updateAnytimeTab(){
    const anytimeTaskCounter = document.querySelector('.anytime > div:last-child');
    const allTasks = getAllTasks();

    anytimeTaskCounter.classList.add('task-count');

    if(allTasks.length < 1){
        anytimeTaskCounter.classList.remove('task-count');
        anytimeTaskCounter.textContent = '';
    }else{
        anytimeTaskCounter.textContent = allTasks.length;
    }    
}

function toggleProjectInputDisplay(){
    const projectInput = document.querySelector('.project-input');
    projectInput.classList.toggle('slide-down');
}

function addProjectEventListeners(){
    const projectElements = document.querySelectorAll('.project');
    const deleteProjectBtns = document.querySelectorAll('.project-delete-btn');

    projectElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            removeCurrentTab();
            selectCurrentTab(event);

            PubSub.publish(CURRENT_TAB);
        });
    });

    deleteProjectBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteProject(event);
        });
    });
}

function addProject(event){
    const projectsList = document.querySelector('.projects-list');

    if(event.key === 'Enter'){
        const errMessageContainer = document.querySelector('.error-container');
        let newProjectName = event.target.value;

        if(!(projectNamesArr.includes(newProjectName))){
            createProjectDiv(projectsList, newProjectName);
            projectNamesArr.push(newProjectName);

            event.target.value = '';
            errMessageContainer.classList.add('hide');

            addProjectEventListeners();
            PubSub.publish(PROJECT_DROPDOWN);
        }else{
            errMessageContainer.classList.remove('hide');
        }
    }
}

function deleteProject(event){
    const deletedProjectText = event.target.previousSibling.textContent;
    const deletedProjectIndex = projectNamesArr.indexOf(deletedProjectText);

    projectNamesArr.splice(deletedProjectIndex, 1);
    event.target.closest('.project').remove();

    PubSub.publish(PROJECT_DROPDOWN);
    PubSub.publish(PROJECT_ATTRIBUTE);
    PubSub.publish(CURRENT_TAB);
}


PubSub.subscribe(GENERAL_LAYOUT, addSideBarEventListeners);
PubSub.subscribe(SIDEBAR_DISPLAY, revealSideBar);
PubSub.subscribe(TASK_COUNT, updateInboxTab);
PubSub.subscribe(TASK_COUNT, updateTodayAndThisWeekTab);
PubSub.subscribe(TASK_COUNT, updateAnytimeTab);
PubSub.subscribe(DEFAULT_CURRENT_TAB, setDefaultCurrentTab);