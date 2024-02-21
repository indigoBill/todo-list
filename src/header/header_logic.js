import PubSub from 'pubsub-js';
import { DEFAULT_CURRENT_TAB, SEARCH_TASKS } from '../barrel.js';

export const EVENT_LISTENERS = 'add event listeners on page load';
export const SIDEBAR_DISPLAY = 'display sidebar';

function createMenuBtnEventListener(){
    const menuBtn = document.querySelector('.menu-btn');

    menuBtn.addEventListener('click', () => {        
        PubSub.publish(SIDEBAR_DISPLAY);
    });
}

function createHomeBtnEventListener(){
    const homeBtn = document.querySelector('.home-btn');

    homeBtn.addEventListener('click', () => {
        PubSub.publish(DEFAULT_CURRENT_TAB);
    });
}

function createSearchBtnEventListener(){
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', () => {
        document.querySelector('#search').focus();
    });
}

function createSearchBarEventListener(){
    const searchBar = document.querySelector('#search');

    searchBar.addEventListener('keydown', () => {
        PubSub.publish(SEARCH_TASKS);
    });
}

function loadEventListeners(){
    createMenuBtnEventListener();
    createHomeBtnEventListener();
    createSearchBtnEventListener();
    createSearchBarEventListener();
}

PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);