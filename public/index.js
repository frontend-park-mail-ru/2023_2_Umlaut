'use strict';

// eslint-disable-next-line
import _ from 'lodash';
import runtime from 'serviceworker-webpack5-plugin/lib/runtime';
import {Router} from './lib/router.js';
import {Api} from './lib/api.js';
import {AuthController} from './components/Auth/AuthController.js';
import {FeedController} from './components/Feed/FeedController.js';
import {EventBus} from './lib/eventbus.js';
import {GLOBAL_EVENTS} from './lib/constansts.js';
import {SignupController} from './components/Signup/SignupController.js';
import {HeaderController} from './components/Header/HeaderController.js';
import {SettingsController} from './components/Settings/SettingsController.js';
import {MessengerController} from './components/Messenger/MessengerController.js';
import {PopupView} from './components/PopUp/PopupView.js';

document.addEventListener('DOMContentLoaded', ()=>{
    if ('serviceWorker' in navigator) {
        runtime.register().catch((error) => {
            console.log('Registration failed with ' + error);
        });
    }

    const root = document.getElementById('root');
    const head = root.querySelector('.header');
    const page = root.querySelector('.main-part');

    const router = new Router();

    const header = new HeaderController(head);
    const popup = new PopupView(root);

    const globalEventBus = new EventBus();
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT, (data) => router.go(data));
    globalEventBus.on(GLOBAL_EVENTS.AUTH, () => header.render());
    globalEventBus.on(GLOBAL_EVENTS.POPUP, () => popup.render());
    globalEventBus.on(GLOBAL_EVENTS.RERENDER_HEADER, () => header.render());
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => {
        header.renderUnauth();
        router.go('/auth');
    });

    globalEventBus.emit(GLOBAL_EVENTS.AUTH);

    const auth = new AuthController(page, globalEventBus);
    const signup = new SignupController(page, globalEventBus);

    const feed = new FeedController(page, globalEventBus);

    const settings = new SettingsController(page, globalEventBus);
    const messenger = new MessengerController(page, globalEventBus);

    router.add('/', feed);
    router.add('/feed', feed);
    router.add('/auth', auth);
    router.add('/signup', signup);
    router.add('/settings', settings);
    router.add('/messages', messenger);

    router.start();
});
