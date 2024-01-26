import './general-layout.css';
import PubSub from 'pubsub-js';

export const GENERAL_LAYOUT = 'load general layout';

function createGeneralLayout(){
    const body = document.querySelector('body');

    function createHeader(){
        const headerElement = document.createElement('header');
        headerElement.classList.add('header');

        body.appendChild(headerElement);
    }

    function addChildrenToMain(domElement){
        const sideBar = document.createElement('div');
        const content = document.createElement('div');

        sideBar.classList.add('side-bar');
        content.classList.add('content');

        domElement.appendChild(sideBar);
        domElement.appendChild(content);
    }

    function createMainSection(){
        const mainSectionDiv = document.createElement('div');
        mainSectionDiv.classList.add('main-section');

        body.appendChild(mainSectionDiv);

        addChildrenToMain(mainSectionDiv);
    }

    function addContentToSideBar(){
        const sideBar = document.querySelector('.side-bar');

        const sideBarContentContainer = document.createElement('div');
        sideBarContentContainer.classList.add('side-bar-content-container');

        sideBar.appendChild(sideBarContentContainer);

        addDiv(sideBarContentContainer, 'INBOX');
        addDiv(sideBarContentContainer, 'TODAY');
        addDiv(sideBarContentContainer, 'UPCOMING');
        addDiv(sideBarContentContainer, 'ANYTIME');

    }

    createHeader();
    createMainSection();
    addContentToSideBar();
}

function addDiv(parentElement, text){
    const div = document.createElement('div');

    div.textContent = text;

    parentElement.appendChild(div);
}

PubSub.subscribe(GENERAL_LAYOUT, createGeneralLayout);