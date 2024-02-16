import PubSub from 'pubsub-js';
import { TASK_ADDER_EVENT_LISTENER, getTaskAdderInput, TASK_EVENT_LISTENER } from '../barrel.js';
import { format, parseISO } from 'date-fns';
import './content.css';

export const content = (function(){

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

        taskBtnContainer.classList.toggle('hide');
    }


    return { createAddTaskBtn, toggleAddTaskBtnDisplay, getContentDiv };
})();

export const taskAdder = (function(){

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
        const today = format(new Date(), 'yyyy-MM-dd');

        datePickerLabel.textContent = 'DUE DATE:';

        datePickerLabel.setAttribute('for', 'date');
        datePicker.setAttribute('id', 'date');
        datePicker.setAttribute('type', 'date');
        datePicker.setAttribute('min', today);

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

    function createProjectDropDown(){
        const selectContainer = document.createElement('div');
        const select = document.createElement('select');
        const selectHeader = document.createElement('option');

        selectHeader.textContent = 'SELECT PROJECT';

        selectContainer.classList.add('project-container');
        
        selectContainer.appendChild(select);
        select.appendChild(selectHeader);

        return selectContainer;
    }

    function createDropDownContainer(){
        const dropDownContainer = document.createElement('div');

        dropDownContainer.classList.add('drop-down-container');

        dropDownContainer.appendChild(createPriorityDropDown());
        dropDownContainer.appendChild(createProjectDropDown());
        
        return dropDownContainer;
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

    function createTaskAdder(){
        const content = document.querySelector('.content');
        const taskContainer = document.createElement('div');
        
        taskContainer.classList.add('task-adder-container');
        taskContainer.classList.add('hide');

        taskContainer.appendChild(createTitleInput());
        taskContainer.appendChild(createDueDateCalendar());
        taskContainer.appendChild(createDescriptionInput());
        taskContainer.appendChild(createDropDownContainer());
        taskContainer.appendChild(createTaskBtns());
        content.appendChild(taskContainer);

        PubSub.publish(TASK_ADDER_EVENT_LISTENER);
    }

    function toggleTaskAdderDisplay(){
        const taskAdder = document.querySelector('.task-adder-container');
    
        taskAdder.classList.toggle('hide');
    }

return { createTaskAdder, toggleTaskAdderDisplay };
})();

export const task = function(){
   
    function createTaskTitle(){
        const titleNode = getTaskAdderInput('title');
        const taskHeaderContainer = document.createElement('div');
        const taskHeader = document.createElement('h3');
        
        taskHeader.textContent = titleNode.value;

        taskHeaderContainer.classList.add('task-title');

        taskHeaderContainer.appendChild(taskHeader);

        return taskHeaderContainer;
    }

    function createTaskDueDate(){
        const dateNode = getTaskAdderInput('date');
        const dateContainer = document.createElement('div');
        const date = document.createElement('p');

        const isoDate = parseISO(dateNode.value);

        date.textContent = format(isoDate, 'MM-dd-yyyy');

        dateContainer.classList.add('task-date');

        dateContainer.appendChild(date);

        return dateContainer;
    }

    function createTaskDescription(){
        const descriptionNode = getTaskAdderInput('description');
        const descriptionContainer = document.createElement('div');
        const description = document.createElement('p');

        if(descriptionNode.value){
            descriptionContainer.classList.add('task-description');
            descriptionContainer.classList.add('hide');

            description.textContent = descriptionNode.value;
            descriptionContainer.appendChild(description);

            return descriptionContainer;
        }
    }

    function createTaskPriority(){
        const priorityNode = getTaskAdderInput('priority');
        const priorityContainer = document.createElement('div');
        const priority = document.createElement('p');

        if(priorityNode.value !== 'SELECT PRIORITY'){
            priorityContainer.classList.add('task-priority');
            priorityContainer.classList.add('hide');

            priority.textContent = priorityNode.value;
            priorityContainer.appendChild(priority);

            return priorityContainer;
        }
    }

    function createCheckBtn(){
        const checkBtn = document.createElement('button');

        checkBtn.classList.add('check-btn');

        return checkBtn;
    }

    function addSvgIcon(className, pathAtt, hideByDefault){
        const svgIconContainer = document.createElement('div');
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        svgIcon.setAttribute('viewBox', '0 0 24 24');
        path.setAttribute('d', pathAtt);

        svgIconContainer.classList.add('svg-icon-container');
        svgIconContainer.classList.add(className);

        svgIcon.appendChild(path);
        svgIconContainer.appendChild(svgIcon);

        if(hideByDefault){
            svgIconContainer.classList.add('hide');
        }

        return svgIconContainer;
    }

    function createPriorityColor(taskContainer, priorityContainer){
        const priorityValue = priorityContainer.firstChild.textContent;
        
        switch (priorityValue) {
            case 'LOW' :
                taskContainer.classList.add('green');
                break;
            case 'MEDIUM' :
                taskContainer.classList.add('orange');
                break;
            case 'HIGH' :
                taskContainer.classList.add('red');
                break;
        }
    }

    function createDeleteBtn(){
        const deleteBtn = document.createElement('button');

        deleteBtn.classList.add('delete-btn');

        deleteBtn.textContent = 'DELETE?';

        return deleteBtn;
    }

    function createTask(){
        const content = document.querySelector('.content');

        const taskContainer = document.createElement('div');
        const checkBtnContainer = document.createElement('div');
        const headerContainer = document.createElement('div');
        const userInputContainer = document.createElement('div');
        const iconContainer = document.createElement('div');

        taskContainer.classList.add('task-container');
        checkBtnContainer.classList.add('check-btn-container');
        headerContainer.classList.add('header-container');
        userInputContainer.classList.add('user-input-container');
        iconContainer.classList.add('icon-container');
        
        iconContainer.appendChild(addSvgIcon('up-down-icon', 'M14,8H11V14H6V8H3L8.5,2L14,8M15.5,22L21,16H18V10H13V16H10L15.5,22Z'));
        iconContainer.appendChild(addSvgIcon('garbage-icon', 'M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z'));

        checkBtnContainer.appendChild(createCheckBtn());

        headerContainer.appendChild(createTaskTitle());
        headerContainer.appendChild(addSvgIcon('edit-icon', 'M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z', true));

        userInputContainer.appendChild(headerContainer);
        userInputContainer.appendChild(createTaskDueDate());

        if(createTaskDescription()){
            userInputContainer.appendChild(createTaskDescription());
        }
        
        if(createTaskPriority()){
            const priorityContainer = createTaskPriority();
            userInputContainer.appendChild(priorityContainer);
            createPriorityColor(taskContainer, priorityContainer);
        }

        taskContainer.appendChild(checkBtnContainer);
        taskContainer.appendChild(userInputContainer);
        taskContainer.appendChild(iconContainer);
        taskContainer.appendChild(createDeleteBtn());

        content.appendChild(taskContainer);

        PubSub.publish(TASK_EVENT_LISTENER);

        return taskContainer;
    }

    return { createTask };
};

