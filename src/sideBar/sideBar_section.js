import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT, SIDEBAR_DISPLAY } from '../barrel.js';
import './sideBar.css';

const sideBar = (function(){
    function createFilterOption(parentElement, filterType){
        const filterOption = document.createElement('div');
        const filterOptionText = document.createElement('div');
        const taskCount = document.createElement('div');
    
        filterOption.classList.add('filter-option');
        filterOptionText.textContent = filterType;
    
        taskCount.classList.add('task-count');
    
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

        createFilterOption(sideBarFilterOptions, 'INBOX');
        createFilterOption(sideBarFilterOptions, 'TODAY');
        createFilterOption(sideBarFilterOptions, 'UPCOMING');
        createFilterOption(sideBarFilterOptions, 'ANYTIME');

        return sideBarFilterOptions;
    }

    function createProjects(){
        const projectsContainer = document.createElement('div');
        const projectsList = document.createElement('div');

        projectsContainer.classList.add('projects-container');
        projectsList.classList.add('projects-list');

        createSideBarTextDiv(projectsContainer, 'PROJECTS', 'projects-title');

        projectsContainer.appendChild(projectsList);

        createSideBarTextDiv(projectsList, 'FILLER 1');
        createSideBarTextDiv(projectsList, 'FILLER 2');
        createSideBarTextDiv(projectsList, 'FILLER 3');

        return projectsContainer;
    }

    function createAddProjectBtn(){
        const btnContainer = document.createElement('div');
        const addProjectBtn = document.createElement('button');

        btnContainer.classList.add('project-btn-container');
        addProjectBtn.classList.add('add-project-btn');

        addProjectBtn.textContent = '+ ADD PROJECT';
        
        btnContainer.appendChild(addProjectBtn);

        return btnContainer;
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
        sideBarContentContainer.appendChild(createAddProjectBtn());

    }

    return { createSideBarSection };
})();


const sideBarDynamic = (function(){
    function revealSideBar(){
        const sideBar = document.querySelector('.side-bar');
        const mediaQuery = window.matchMedia('(max-width: 500px)');

        if(mediaQuery.matches){
            sideBar.classList.toggle('side-bar-cover');
            sideBar.classList.remove('side-bar-push');
        }else{
            sideBar.classList.toggle('side-bar-push');
            sideBar.classList.remove('side-bar-cover');
        }
    }

    return { revealSideBar };
})();


PubSub.subscribe(GENERAL_LAYOUT, sideBar.createSideBarSection);
PubSub.subscribe(SIDEBAR_DISPLAY, sideBarDynamic.revealSideBar);

