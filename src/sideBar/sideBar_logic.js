import PubSub from "pubsub-js";
import { GENERAL_LAYOUT, SIDEBAR_DISPLAY, createSideBarTextDiv } from '../barrel.js';
import { isToday, isThisWeek } from 'date-fns';

export const TASK_COUNT = 'update the task counters in the sidebar';

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

function addSideBarEventListeners(){
    const sideBarElements = document.querySelectorAll('.filter-option, .project');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const projectInput = document.querySelector('.project-input');


    sideBarElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            removeCurrentTab();
            selectCurrentTab(event);
        });
    });

    addProjectBtn.addEventListener('click', toggleProjectInputDisplay);

    projectInput.addEventListener('keydown', addProject);
}

function getAllTasks(){
    const allTasks = document.querySelectorAll('[task-index]');

    return allTasks;
}

//WHEN A TASK IS CREATED UNDER A PROJECT IT SHOULD HAVE AN ATTRIBUTE CALLED PROJECT
//WITH ITS VALUE EQUALLING TO THE PROJECT NAME
function updateInboxTab(){
    //IF TASK DOESNT HAVE A PROJECT ATTRIBUTE ITLL COUNT TO THE INBOX TAB

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

function addProject(event){
    const projectsList = document.querySelector('.projects-list');

    if(event.key === 'Enter'){
        createSideBarTextDiv(projectsList, event.target.value, 'project');
        event.target.value = '';
    }
}

PubSub.subscribe(GENERAL_LAYOUT, addSideBarEventListeners);
PubSub.subscribe(SIDEBAR_DISPLAY, revealSideBar);
PubSub.subscribe(TASK_COUNT, updateTodayAndThisWeekTab);
PubSub.subscribe(TASK_COUNT, updateAnytimeTab);