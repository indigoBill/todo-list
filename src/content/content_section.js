import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT, CREATE_TASK_ADDER, TASK_ADDER_EVENT_LISTENER, CHECK_TASK_INPUTS } from '../barrel.js';
import './content.css';

const content = (function(){

    function getContentDiv(){
        const content = document.querySelector('.content');

        return content;
    }

    function createAddTaskBtn(){
        const content = getContentDiv();

        const taskAdderContainer = document.createElement('div');
        const addTaskBtn = document.createElement('button');

        taskAdderContainer.classList.add('add-task-btn-container');
        addTaskBtn.classList.add('add-task-btn');

        addTaskBtn.textContent = '+ ADD TASK';

        taskAdderContainer.appendChild(addTaskBtn);
        content.appendChild(taskAdderContainer);
    }

    function toggleAddTaskBtnDisplay(){
        const taskBtnContainer = document.querySelector('.add-task-btn-container');

        taskBtnContainer.classList.toggle('hide-task-btn');
    }


    return { createAddTaskBtn, toggleAddTaskBtnDisplay, getContentDiv };
})();

const taskAdder = (function(){

    function createRequiredLabel(){
        const requiredContainer = document.createElement('div');
        const requiredText = document.createElement('p');

        requiredContainer.classList.add('required-container');

        requiredText.textContent = 'REQUIRED';

        requiredContainer.appendChild(requiredText);

       return requiredContainer;
    }

    function createTitleInput(){
        const titleContainer = document.createElement('div');
        const titleLabel = document.createElement('label');
        const title = document.createElement('input');

        titleLabel.textContent = 'TITLE:';

        titleLabel.setAttribute('for', 'title');
        title.setAttribute('id', 'title');

        title.required = true;

        titleContainer.classList.add('title-container');

        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(title);
        titleContainer.appendChild(createRequiredLabel());

        return titleContainer;
    }

    function createDueDateCalendar(){
        const datePickerContainer = document.createElement('div');
        const datePickerLabel = document.createElement('label');
        const datePicker = document.createElement('input');

        datePickerLabel.textContent = 'DUE DATE:';

        datePickerLabel.setAttribute('for', 'date');
        datePicker.setAttribute('id', 'date');
        datePicker.setAttribute('type', 'date');

        datePicker.required = true;

        datePickerContainer.classList.add('date-picker-container');

        datePickerContainer.appendChild(datePickerLabel);
        datePickerContainer.appendChild(datePicker);
        datePickerContainer.appendChild(createRequiredLabel());

        return datePickerContainer;
    }

    function createDescriptionInput(){
        const descriptionContainer = document.createElement('div');
        const descriptionLabel = document.createElement('label');
        const description = document.createElement('input');

        descriptionLabel.textContent = 'DESCRIPTION:';

        descriptionLabel.setAttribute('for', 'description');
        description.setAttribute('id', 'description');

        descriptionContainer.classList.add('description-container');

        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(description);

        return descriptionContainer;
    }

    function createPriorityDropDown(){
        const selectContainer = document.createElement('div');
        const select = document.createElement('select');
        const selectHeader = document.createElement('option');
        const lowPriority = document.createElement('option');
        const mediumPriority = document.createElement('option');
        const highPriority = document.createElement('option');

        selectHeader.textContent = 'SELECT PRIORITY';
        lowPriority.textContent = 'LOW';
        mediumPriority.textContent = 'MEDIUM';
        highPriority.textContent = 'HIGH';

        selectContainer.classList.add('priority-container');

        selectContainer.appendChild(select);
        select.appendChild(selectHeader);
        select.appendChild(lowPriority);
        select.appendChild(mediumPriority);
        select.appendChild(highPriority);

        return selectContainer;
    }

    function createTaskBtns(){
        const btnContainer = document.createElement('div');
        const addBtn = document.createElement('button');
        const cancelBtn = document.createElement('button');

        addBtn.classList.add('add-btn');
        cancelBtn.classList.add('cancel-btn');

        addBtn.textContent = 'ADD';
        cancelBtn.textContent = 'CANCEL';

        btnContainer.classList.add('btn-container');

        btnContainer.appendChild(addBtn);
        btnContainer.appendChild(cancelBtn);

        return btnContainer;
    }

    function openTaskAdder(){
        const content = document.querySelector('.content');
        const taskContainer = document.createElement('div');
        
        taskContainer.classList.add('task-adder-container');

        taskContainer.appendChild(createTitleInput());
        taskContainer.appendChild(createDueDateCalendar());
        taskContainer.appendChild(createDescriptionInput());
        taskContainer.appendChild(createPriorityDropDown());
        taskContainer.appendChild(createTaskBtns());
        content.appendChild(taskContainer);

        PubSub.publish(TASK_ADDER_EVENT_LISTENER);
    }

    return { openTaskAdder };
})();

const addedTask = (function(){

    function getTaskTitle(){
        const titleNode = document.querySelector('#title');

        return titleNode;
    }

    function getTaskDueDate(){
        const dateNode = document.querySelector('#date');

        return dateNode;
    }

    function getDescription(){
        const descriptionNode = document.querySelector('#description');

        return descriptionNode;
    }

    function getPriority(){
        const priorityNode = document.querySelector('select');

        return priorityNode;
    }

    function createTaskTitle(){
        const titleNode = getTaskTitle();
        const taskHeaderContainer = document.createElement('div');
        const taskHeader = document.createElement('h3');
        
        taskHeader.textContent = titleNode.value;

        taskHeaderContainer.classList.add('task-title');

        taskHeaderContainer.appendChild(taskHeader);

        return taskHeaderContainer;
    }

    function createTaskDueDate(){
        const dateNode = getTaskDueDate();
        const dateContainer = document.createElement('div');
        const date = document.createElement('p');

        date.textContent = dateNode.value;

        dateContainer.classList.add('task-date');

        dateContainer.appendChild(date);

        return dateContainer;
    }

    function createTaskDescription(){
        const descriptionNode = getDescription();
        const descriptionContainer = document.createElement('div');
        const description = document.createElement('p');

        if(descriptionNode.value){
            descriptionContainer.classList.add('task-description');

            description.textContent = descriptionNode.value;
            descriptionContainer.appendChild(description);

            return descriptionContainer;
        }
    }

    function createTaskPriority(){
        const priorityNode = getPriority();
        const priorityContainer = document.createElement('div');
        const priority = document.createElement('p');

        if(priorityNode.value !== 'SELECT PRIORITY'){
            priorityContainer.classList.add('task-priority');

            priority.textContent = priorityNode.value;
            priorityContainer.appendChild(priority);

            return priorityContainer;
        }
    }

    function createAddedTask(){
        const content = document.querySelector('.content');

        const taskContainer = document.createElement('div');
        
        taskContainer.appendChild(createTaskTitle());
        taskContainer.appendChild(createTaskDueDate());

        if(createTaskDescription()){
            taskContainer.appendChild(createTaskDescription());
        }
        
        if(createTaskPriority()){
            taskContainer.appendChild(createTaskPriority());
        }

        content.appendChild(taskContainer);
    }

    function clearInputs(){
        const title = getTaskTitle();
        const date = getTaskDueDate();
        const description = getDescription();
        const priority = getPriority();

        const inputs = [title, date, description, priority];

        inputs.forEach((input) => {
            input.value = '';
        });
    }


    function checkRequiredInputValues(){
        const titleNode = getTaskTitle();
        const dateNode = getTaskDueDate();

        if(titleNode.value && dateNode.value){
            createAddedTask();
            clearInputs();
        }
    }

    return { checkRequiredInputValues };
})();

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(CREATE_TASK_ADDER, taskAdder.openTaskAdder);
PubSub.subscribe(CREATE_TASK_ADDER, content.toggleAddTaskBtnDisplay);
PubSub.subscribe(CHECK_TASK_INPUTS, addedTask.checkRequiredInputValues);
