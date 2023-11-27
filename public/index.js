'use strict';

// eslint-disable-next-line
import _ from 'lodash';
import './index.scss';
import '../static/reset.css';
import runtime from 'serviceworker-webpack5-plugin/lib/runtime';
import {Router} from './lib/router.js';
import {AuthController} from './components/Auth/AuthController.js';
import {FeedController} from './components/Feed/FeedController.js';
import {EventBus} from './lib/eventbus.js';
import {GLOBAL_EVENTS} from './lib/constansts.js';
import {SignupController} from './components/Signup/SignupController.js';
import {HeaderController} from './components/Header/HeaderController.js';
import {SettingsController} from './components/Settings/SettingsController.js';
import {MessengerController} from './components/Messenger/MessengerController.js';
import {PopupView} from './components/PopUp/PopupView.js';
import {CsatController} from './components/Csat/CsatController.js';
import {AdminAuthController} from './components/AdminAuth/AdminAuthController.js';
import {StatisticsController} from './components/Statistics/StatisticsController.js';

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

    const popup = new PopupView(root);

    const globalEventBus = new EventBus();
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT, (data) => router.go(data));
    globalEventBus.on(GLOBAL_EVENTS.POPUP, (text) => popup.render(text));
    globalEventBus.on(GLOBAL_EVENTS.NETWORK_ERROR, ()=>popup.render('Сервер временно не доступен, повторите попытку позже'));
    globalEventBus.on(GLOBAL_EVENTS.POPUP_CONFIRM, (data) => popup.renderConfirm(data));
    globalEventBus.on(GLOBAL_EVENTS.RERENDER_HEADER, () => globalEventBus.emit(GLOBAL_EVENTS.CHECK_AUTHORISED));
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => router.go('/auth') );

    window.addEventListener('offline', () => {
        popup.render('Отсутсвует подключение к интернету');
    });

    window.addEventListener('online', () => {
        popup.render('Подключение восстановлено');
    });

    const csat = new CsatController(document.body, globalEventBus);
    csat;

    const header = new HeaderController(head, globalEventBus);
    header;
    const auth = new AuthController(page, globalEventBus);
    const signup = new SignupController(page, globalEventBus);

    const feed = new FeedController(page, globalEventBus);

    const settings = new SettingsController(page, globalEventBus);
    const messenger = new MessengerController(page, globalEventBus);
    const admin = new AdminAuthController(page, globalEventBus);
    const statisctics = new StatisticsController(page, globalEventBus);


    router.add('/', feed);
    router.add('/feed', feed);
    router.add('/auth', auth);
    router.add('/signup', signup);
    router.add('/settings', settings);
    router.add('/messages', messenger);
    router.add('/admin', statisctics);
    router.add('/admin/auth', admin);

    globalEventBus.emit(GLOBAL_EVENTS.CHECK_AUTHORISED);
    router.start();
});
