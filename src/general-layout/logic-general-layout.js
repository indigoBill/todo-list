import PubSub from 'pubsub-js';

export const EVENT_LISTENERS = 'load event listeners';
export const LISTENER = 'top level listener topic';

function createMenuBtnEventListener(){
    const menuBtn = document.querySelector('.menu-btn');

    menuBtn.addEventListener('click', () => {
        console.log('testing');
        PubSub.publish(LISTENER.sideBar);
    });
};

function loadEventListeners(){
    createMenuBtnEventListener();
}

PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);