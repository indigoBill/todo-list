import PubSub from 'pubsub-js';

export const EVENT_LISTENERS = 'load event listeners';
export const LISTENER = 'top level header section listener topic';

function createMenuBtnEventListener(){
    const menuBtn = document.querySelector('.menu-btn');

    menuBtn.addEventListener('click', () => {
        PubSub.publish(LISTENER.main);
    });
};

function loadEventListeners(){
    createMenuBtnEventListener();
}

PubSub.subscribe(EVENT_LISTENERS, loadEventListeners);