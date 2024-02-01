import PubSub from 'pubsub-js';
import './header.css';

export const GENERAL_LAYOUT = 'load general layout';

const body = document.querySelector('body');

const header = (function(){
    function createHeaderTitle(){
        const headerTitleContainer = document.createElement('div');
        const headerTitle = document.createElement('div');

        headerTitleContainer.classList.add('header-title-container');
        headerTitle.classList.add('header-title');

        headerTitle.textContent = 'Todo List';

        headerTitleContainer.appendChild(headerTitle);

        return headerTitleContainer;
    }

    function createIconButton(iconClass){
        const iconBtnContainer = document.createElement('div');
        const iconBtn = document.createElement('button');

        iconBtnContainer.classList.add('icon-btn-container');
        iconBtn.classList.add('icon-btn');
        iconBtn.classList.add(iconClass);

        iconBtnContainer.appendChild(iconBtn);

        return iconBtnContainer;
    }

    function createSearchInput(){
        const inputContainer = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');

        label.setAttribute('for', 'search');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'search');
        input.setAttribute('id', 'search');

        inputContainer.classList.add('input-container');
        label.classList.add('visually-hidden');

        inputContainer.appendChild(createIconButton('search-btn'));
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);

        return inputContainer;
    }
    
    function createHeaderSection(){
        const headerElement = document.createElement('header');
        const headerContentContainer = document.createElement('div');
        const headerTopSection = document.createElement('div');
        const headerBottomSection = document.createElement('div');

        headerElement.classList.add('header');
        headerContentContainer.classList.add('header-content-container');
        headerTopSection.classList.add('header-top-section');
        headerBottomSection.classList.add('header-bottom-section');

        body.appendChild(headerElement);
        headerElement.appendChild(headerContentContainer);
        headerContentContainer.appendChild(headerTopSection);
        headerContentContainer.appendChild(headerBottomSection);

        headerTopSection.appendChild(createHeaderTitle());
        headerTopSection.appendChild(createSearchInput());
        headerBottomSection.appendChild(createIconButton('menu-btn'));
        headerBottomSection.appendChild(createIconButton('home-btn'));
        headerBottomSection.appendChild(createIconButton('add-btn'));
    }

    return { createHeaderSection };
})();

PubSub.subscribe(GENERAL_LAYOUT, header.createHeaderSection);