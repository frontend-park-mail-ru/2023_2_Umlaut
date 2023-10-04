'use strict';


import {Router} from './modules/router.js';
import {Auth} from './components/Auth/Auth.js';
import {Signup} from './components/Signup/Signup.js';
import {Header} from './components/Header/Header.js';
import {Menu} from './components/Menu/Menu.js';
import {Feed} from './components/Feed/Feed.js';
import {Api} from './modules/api.js';


const router = new Router();

const auth = new Auth(document.getElementById('root'), () => router.go('/feed'));
const signup = new Signup(document.getElementById('root'), () => router.go('/feed'));
const header = new Header();

const menuItems = {
    feed: {
        href: '/feed',
        name: 'Лента',
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
    },
    notifications: {
        href: '/notifications',
        name: 'Уведомления',
    },
    messages: {
        href: '/messages',
        name: 'Сообщения',
    },
};

const menu = new Menu(menuItems, () => header.render());
const feed = new Feed(() => router.go('/messages'), () => menu.render(), () => router.go('/auth'));
// menu.render();

router.add('/', () => router.go('/feed'));
router.add('/feed', () => feed.render());
router.add('/auth', () => auth.render());
router.add('/signup', () => signup.render());
router.add('/logout', () => {
    Api.logout(); router.go('/auth');
});

router.start();
