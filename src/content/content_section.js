import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT } from '../barrel.js';
import './content.css';

const content = function(){

    const content = document.querySelector('.content');

    function createAddTaskButton(){
        const taskAdderContainer = document.createElement('div');
        const taskAdderBtn = document.createElement('button');

        taskAdderContainer.classList.add('add-task-btn-container');
        taskAdderBtn.classList.add('add-task-btn');

        taskAdderBtn.textContent = '+ ADD TASK';

        taskAdderContainer.appendChild(taskAdderBtn);
        content.appendChild(taskAdderContainer);
    }

    function createTitleInput(){
        const titleContainer = document.createElement('div');
        const titleLabel = document.createElement('label');
        const title = document.createElement('input');

        titleLabel.textContent = 'TITLE:';

        titleLabel.setAttribute('for', 'title');
        title.setAttribute('id', 'title');

        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(title);

        return titleContainer;
    }

    function createDescriptionInput(){
        const descriptionContainer = document.createElement('div');
        const descriptionLabel = document.createElement('label');
        const description = document.createElement('input');

        descriptionLabel.textContent = 'DESCRIPTION:';

        descriptionLabel.setAttribute('for', 'description');
        description.setAttribute('id', 'description');

        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(description);

        return descriptionContainer;
    }

    function createDueDateCalendar(){

    }

    function createTask(){
        const taskContainer = document.createElement('div');
        
        taskContainer.classList.add('task-container');

        taskContainer.appendChild(createTitleInput());
        taskContainer.appendChild(createDescriptionInput());

        content.appendChild(taskContainer);
    }

    createAddTaskButton();
    createTask();
};

PubSub.subscribe(GENERAL_LAYOUT, content);