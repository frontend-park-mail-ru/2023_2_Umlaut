'use strict';

import {Router} from './lib/router.js';
//import {Header} from './components/Header/Header.js';
// import {Menu} from './components/Menu/Menu.js';
// import {Feed} from './components/Feed/Feed.js';
import {Api} from './lib/api.js';
import {AuthController} from './components/Auth/AuthController.js';
import {FeedController} from './components/Feed/FeedController.js';
import {EventBus} from './lib/eventbus.js';
import {GLOBAL_EVENTS} from './lib/constansts.js';
import {SingupController} from './components/Signup/SingupController.js';

document.addEventListener('DOMContentLoaded', ()=>{
    const root = document.getElementById('root');
    const router = new Router();
    const globalEventBus = new EventBus();
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT, (data) => router.go(data));
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => router.go('/auth'));


    const auth = new AuthController(root, globalEventBus);
    const signup = new SingupController(root, globalEventBus);
    // const header = new Header(() => {
    //    Api.logout(); router.go('/auth');
    // });

    // const menuItems = {
    //     feed: {
    //         href: '/feed',
    //         name: 'Лента',
    //     },
    //     profile: {
    //         href: '/profile',
    //         name: 'Профиль',
    //     },
    //     notifications: {
    //         href: '/notifications',
    //         name: 'Уведомления',
    //     },
    //     messages: {
    //         href: '/messages',
    //         name: 'Сообщения',
    //     },
    // };

    // const menu = new Menu(menuItems, () => header.render());
    // const feed = new Feed(() => menu.render(), router);
    const feed = new FeedController(root, globalEventBus);

    router.add('/', () => router.go('/feed'));
    router.add('/feed', () => feed.render());
    router.add('/auth', () => auth.render());
    router.add('/signup', () => signup.render());
    router.add('/logout', async () => {
        await Api.logout(); router.go('/auth');
    });

    router.start();
});
