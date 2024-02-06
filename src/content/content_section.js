import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT, SHOW_TASK_ADDER, TASK_ADDER_EVENT_LISTENER, CHECK_TASK_INPUTS } from '../barrel.js';
import { endOfYesterday, format } from 'date-fns';
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

        taskBtnContainer.classList.toggle('hide');
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

    function getInput(inputName){
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
                input = document.querySelector('select');
                break;
        }

        return input;
    }

    function clearInputs(){
        const title = getInput('title');
        const date = getInput('date');
        const description = getInput('description');
        const priority = getInput('priority');

        const inputs = [title, date, description, priority];

        inputs.forEach((input) => {
            if(input.type.includes('select')){
                input.selectedIndex = 0; 
            }else {
                input.value = '';
            }
        });
    }

    function openTaskAdder(){
        const content = document.querySelector('.content');
        const taskContainer = document.createElement('div');
        
        taskContainer.classList.add('task-adder-container');
        taskContainer.classList.add('hide');

        taskContainer.appendChild(createTitleInput());
        taskContainer.appendChild(createDueDateCalendar());
        taskContainer.appendChild(createDescriptionInput());
        taskContainer.appendChild(createPriorityDropDown());
        taskContainer.appendChild(createTaskBtns());
        content.appendChild(taskContainer);

        PubSub.publish(TASK_ADDER_EVENT_LISTENER);
    }

    function toggleTaskAdderDisplay(){
        const taskAdder = document.querySelector('.task-adder-container');

        taskAdder.classList.toggle('hide');
    }

    return { openTaskAdder, getInput, clearInputs, toggleTaskAdderDisplay };
})();

const addedTask = (function(){
   
    function createTaskTitle(){
        const titleNode = taskAdder.getInput('title');
        const taskHeaderContainer = document.createElement('div');
        const taskHeader = document.createElement('h3');
        
        taskHeader.textContent = titleNode.value;

        taskHeaderContainer.classList.add('task-title');

        taskHeaderContainer.appendChild(taskHeader);

        return taskHeaderContainer;
    }

    function createTaskDueDate(){
        const dateNode = taskAdder.getInput('date');
        const dateContainer = document.createElement('div');
        const date = document.createElement('p');

        date.textContent = dateNode.value;

        dateContainer.classList.add('task-date');

        dateContainer.appendChild(date);

        return dateContainer;
    }

    function createTaskDescription(){
        const descriptionNode = taskAdder.getInput('description');
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
        const priorityNode = taskAdder.getInput('priority');
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

        taskContainer.classList.add('task-container');
        
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

    function checkRequiredInputValues(){
        const titleNode = taskAdder.getInput('title');
        const dateNode = taskAdder.getInput('date');

        if(titleNode.value && dateNode.value){
            createAddedTask();
            taskAdder.clearInputs();
            content.toggleAddTaskBtnDisplay();
            taskAdder.toggleTaskAdderDisplay();
        }
    }

    return { checkRequiredInputValues };
})();

PubSub.subscribe(GENERAL_LAYOUT, content.createAddTaskBtn);
PubSub.subscribe(GENERAL_LAYOUT, taskAdder.openTaskAdder);
PubSub.subscribe(SHOW_TASK_ADDER, taskAdder.clearInputs);
PubSub.subscribe(SHOW_TASK_ADDER, taskAdder.toggleTaskAdderDisplay);
PubSub.subscribe(SHOW_TASK_ADDER, content.toggleAddTaskBtnDisplay);
PubSub.subscribe(CHECK_TASK_INPUTS, addedTask.checkRequiredInputValues);
