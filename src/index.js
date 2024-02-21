import { GENERAL_LAYOUT, EVENT_LISTENERS } from './barrel.js';
import PubSub from 'pubsub-js';

document.addEventListener('DOMContentLoaded', () => {
    PubSub.publish(GENERAL_LAYOUT);
    PubSub.publish(EVENT_LISTENERS);
});

// function populateStorage(){
//     const allProjects = document.querySelectorAll('.project');
//     const allTasks = document.querySelectorAll('.task-container');
//     let projectCounter = 1;
//     let taskCounter = 1;

//     allProjects.forEach((project) => {
//         let projectKey = 'project' + projectCounter;

//         localStorage.setItem(projectKey, JSON.stringify(project));
//     });

//     allTasks.forEach((task) => {
//         let taskKey = 'task' + taskCounter;

//         localStorage.setItem(taskKey, JSON.stringify(task));
//     });
    
// }


