import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT } from '../barrel.js';
import './sideBar.css';


function createFilterOption(parentElement, filterType, ...classNames){
    const filterOption = document.createElement('div');
    const filterOptionText = document.createElement('div');
    const taskCount = document.createElement('div');

    filterOption.classList.add('filter-option');

    filterOptionText.textContent = filterType;

    classNames.forEach((className) => {
        filterOption.classList.add(className.toLowerCase());
    });

    filterOption.appendChild(filterOptionText);
    filterOption.appendChild(taskCount);

    parentElement.appendChild(filterOption);
}

function createSideBarTextDiv(parentElement, text, className){
    const div = document.createElement('div');
    
    if(text) div.textContent = text;

    if(className) div.classList.add(`${className}`);

    parentElement.appendChild(div);
}

function createSideBarFilterOptions(){
    const sideBarFilterOptions = document.createElement('div');
    sideBarFilterOptions.classList.add('side-bar-filter-options');

    createFilterOption(sideBarFilterOptions, 'INBOX', 'inbox', 'current-tab');
    createFilterOption(sideBarFilterOptions, 'TODAY', 'today');
    createFilterOption(sideBarFilterOptions, 'THIS WEEK', 'this-week');
    createFilterOption(sideBarFilterOptions, 'ANYTIME', 'anytime');

    return sideBarFilterOptions;
}

function createProjects(){
    const projectsContainer = document.createElement('div');
    const projectsList = document.createElement('div');

    projectsContainer.classList.add('projects-container');
    projectsList.classList.add('projects-list');

    createSideBarTextDiv(projectsContainer, 'PROJECTS', 'projects-title');

    projectsContainer.appendChild(projectsList);

    return projectsContainer;
}

export function createProjectDiv(parentElement, text){
    const project = document.createElement('div');
    const projectText = document.createElement('div');
    const deleteProjectBtn = document.createElement('button');

    project.classList.add('project');
    projectText.classList.add('project-text');
    deleteProjectBtn.classList.add('project-delete-btn');
    
    if(text) projectText.textContent = text;
    deleteProjectBtn.textContent = 'x';

    project.appendChild(projectText);
    project.appendChild(deleteProjectBtn);

    parentElement.appendChild(project);
}

function createAddProjectSection(){
    const addProjectContainer = document.createElement('div');
    const btnContainer = document.createElement('div');
    const addProjectBtn = document.createElement('button');
    const projectInputContainer = document.createElement('div');
    const projectInput = document.createElement('input');
    const errorContainer = document.createElement('div');
    const errorMessage = document.createElement('p');

    addProjectContainer.classList.add('add-project-container');
    btnContainer.classList.add('project-btn-container');
    addProjectBtn.classList.add('add-project-btn');
    projectInputContainer.classList.add('project-input-container');
    projectInput.classList.add('project-input');
    errorContainer.classList.add('error-container');
    errorContainer.classList.add('hide');
    errorMessage.classList.add('error-message');

    addProjectBtn.textContent = '+ ADD PROJECT';
    errorMessage.textContent = 'DUPLICATE NAMES NOT ALLOWED';
    
    addProjectContainer.appendChild(btnContainer);
    addProjectContainer.appendChild(projectInputContainer);
    addProjectContainer.appendChild(errorContainer);
    btnContainer.appendChild(addProjectBtn);
    projectInputContainer.appendChild(projectInput);
    errorContainer.appendChild(errorMessage);

    return addProjectContainer;
}

function createSideBarDivider(){
    const dividerContainer = document.createElement('div');
    const divider = document.createElement('div');

    dividerContainer.classList.add('divider-container');
    divider.classList.add('side-bar-divider');

    dividerContainer.appendChild(divider);

    return dividerContainer;
}

function createSideBarSection(){
    const sideBar = document.querySelector('.side-bar');
    const sideBarContentContainer = document.createElement('div');

    sideBarContentContainer.classList.add('side-bar-content-container');
    
    sideBar.appendChild(sideBarContentContainer);
    sideBarContentContainer.appendChild(createSideBarFilterOptions());
    sideBarContentContainer.appendChild(createSideBarDivider());
    sideBarContentContainer.appendChild(createProjects());
    sideBarContentContainer.appendChild(createSideBarDivider());
    sideBarContentContainer.appendChild(createAddProjectSection());

}



PubSub.subscribe(GENERAL_LAYOUT, createSideBarSection);

