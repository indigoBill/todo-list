import PubSub from "pubsub-js";
import { GENERAL_LAYOUT, SIDEBAR_DISPLAY } from '../barrel.js';
import { isToday } from 'date-fns';

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

    sideBarElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            removeCurrentTab();
            selectCurrentTab(event);
        });
    })
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

function updateTodayTab(){
    let tasksDueToday = 0;
    const todayTaskCounter = document.querySelector('.today > div:last-child');    
    const allTaskDates = document.querySelectorAll('.task-date');

    allTaskDates.forEach((date) => {
        if(isToday(date.textContent)){
            tasksDueToday++;
            todayTaskCounter.textContent = tasksDueToday;
        }
    });

    if(tasksDueToday > 0){
        todayTaskCounter.classList.add('task-count');
    }else{
        todayTaskCounter.textContent = '';
        todayTaskCounter.classList.remove('task-count');
    }
}


function updateUpcomingTab(){
    //IF TASK DATE IS WITHIN THE WEEK COUNT TO UPCOMING TAB

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

PubSub.subscribe(GENERAL_LAYOUT, addSideBarEventListeners);
PubSub.subscribe(SIDEBAR_DISPLAY, revealSideBar);
PubSub.subscribe(TASK_COUNT, updateAnytimeTab);
PubSub.subscribe(TASK_COUNT, updateTodayTab);
