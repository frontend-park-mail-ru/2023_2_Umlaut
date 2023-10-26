'use strict';

import {Router} from './lib/router.js';
import {Api} from './lib/api.js';
import {AuthController} from './components/Auth/AuthController.js';
import {FeedController} from './components/Feed/FeedController.js';
import {EventBus} from './lib/eventbus.js';
import {GLOBAL_EVENTS} from './lib/constansts.js';
import {SignupController} from './components/Signup/SignupController.js';
import { HeaderController } from './components/Header/HeaderController.js';

document.addEventListener('DOMContentLoaded', ()=>{
    const root = document.getElementById('root');
    const head = document.createElement('div');
    head.className = 'header';
    const page = document.createElement('div');
    root.appendChild(head);
    root.appendChild(page);

    const router = new Router();
    
    const header = new HeaderController(head);

    const globalEventBus = new EventBus();
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT, (data) => router.go(data));
    globalEventBus.on(GLOBAL_EVENTS.AUTH, () => header.render());
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => router.go('/auth'));
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => header.renderUnauth());

    globalEventBus.emit(GLOBAL_EVENTS.AUTH)

    const auth = new AuthController(page, globalEventBus);
    const signup = new SignupController(page, globalEventBus);

    const feed = new FeedController(page, globalEventBus);

    router.add('/', () => router.go('/feed'));
    router.add('/feed', () => feed.render());
    router.add('/auth', () => auth.render());
    router.add('/signup', () => signup.render());
    router.add('/logout', async () => {
        await Api.logout(); globalEventBus.emit(GLOBAL_EVENTS.UNAUTH); router.go('/auth'); 
    });

    router.start();
});
