import PubSub from 'pubsub-js';
import { GENERAL_LAYOUT, LISTENER } from '../barrel.js';
import './main.css';

const body = document.querySelector('body');

const main = (function(){
    function addChildrenToMainSection(domElement){
        const sideBar = document.createElement('nav');
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

        addChildrenToMainSection(mainSectionDiv);
    }

    return { createMainSection };
})();

const mainDynamic = (function(){
    function toggleSideBarDisplay(){
        const mainSection = document.querySelector('.main-section');

        mainSection.classList.toggle('main-section-slide');
    }

    return { toggleSideBarDisplay };
})();


PubSub.subscribe(GENERAL_LAYOUT, main.createMainSection);
PubSub.subscribe(LISTENER.main, mainDynamic.toggleSideBarDisplay);
