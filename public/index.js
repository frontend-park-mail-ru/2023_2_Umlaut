'use strict';

// eslint-disable-next-line
import _, { round } from 'lodash';
import './index.scss';
import '../static/reset.css';
import runtime from 'serviceworker-webpack5-plugin/lib/runtime';
import {Router} from './lib/router.js';
import {AuthController} from './components/Auth/AuthController.js';
import {FeedController} from './components/Feed/FeedController.js';
import {EventBus} from './lib/eventbus.js';
import {COMMON_EVENTS, GLOBAL_EVENTS} from './lib/constansts.js';
import {SignupController} from './components/Signup/SignupController.js';
import {HeaderController} from './components/Header/HeaderController.js';
import {SettingsController} from './components/Settings/SettingsController.js';
import {MessengerController} from './components/Messenger/MessengerController.js';
import {PopupView} from './components/PopUp/PopupView.js';
import {CsatController} from './components/Csat/CsatController.js';
import {AdminAuthController} from './components/AdminAuth/AdminAuthController.js';
import {StatisticsController} from './components/Statistics/StatisticsController.js';
import {ComplainsController} from './components/Complains/ComplainsController.js';
import {PremiumController} from './components/Premium/PremiumController.js';

document.addEventListener('DOMContentLoaded', async ()=>{
    if ('serviceWorker' in navigator) {
        runtime.register().catch((error) => {
            console.log('Registration failed with ' + error);
        });
    }

    const root = document.getElementById('root');
    const head = root.querySelector('.header');
    const page = root.querySelector('.main-part');
    const side = document.querySelector('.sidebar');

    const router = new Router();

    const popup = new PopupView(root);

    const globalEventBus = new EventBus();
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT, (data) => router.goOnlyForward(data));
    globalEventBus.on(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, (data) => router.go(data));
    globalEventBus.on(GLOBAL_EVENTS.POPUP, (text) => popup.render(text));
    globalEventBus.on(GLOBAL_EVENTS.SERVER_ERROR, ()=>{
        popup.render('Сервер временно не доступен, повторите попытку позже');
    });
    globalEventBus.on(GLOBAL_EVENTS.NETWORK_ERROR, ()=>{
        popup.render('Отсутствует подключение к интернету');
    });
    globalEventBus.on(GLOBAL_EVENTS.POPUP_CONFIRM, (data) => popup.renderConfirm(data));
    globalEventBus.on(GLOBAL_EVENTS.POPUP_SETTINGS, () => {
        popup.renderPopupAboutSettings(); console.log('aboba');
    });
    globalEventBus.on(GLOBAL_EVENTS.NEW_MESSAGE, (mes) => popup.renderNewMessage(mes));
    globalEventBus.on(GLOBAL_EVENTS.POPUP_COMPLAINT, (data) => popup.renderComplaint(data));
    globalEventBus.on(GLOBAL_EVENTS.POPUP_MATCH, (data) => popup.renderMatch(data));
    globalEventBus.on(GLOBAL_EVENTS.RERENDER_HEADER, () => globalEventBus.emit(GLOBAL_EVENTS.CHECK_AUTHORISED));
    globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => router.goOnlyForward('/auth') );
    globalEventBus.on(GLOBAL_EVENTS.USER_BANNED, () => {
        popup.render('Вы были заблокированы за нарушение правил');
        router.go('/auth');
    });

    window.addEventListener('offline', () => {
        popup.render('Отсутствует подключение к интернету');
        globalEventBus.emit(COMMON_EVENTS.OFFLINE);
    });

    window.addEventListener('online', () => {
        popup.render('Подключение восстановлено');
        globalEventBus.emit(COMMON_EVENTS.ONLINE);
    });

    const csat = new CsatController(document.body, globalEventBus);
    csat;

    const header = new HeaderController(head, side, globalEventBus);
    header;
    const auth = new AuthController(page, globalEventBus);
    const signup = new SignupController(page, globalEventBus);

    const feed = new FeedController(page, globalEventBus);

    const settings = new SettingsController(page, globalEventBus);
    const messenger = new MessengerController(page, globalEventBus);
    const admin = new AdminAuthController(page, globalEventBus);
    const statistics = new StatisticsController(page, globalEventBus);
    const complaints = new ComplainsController(page, globalEventBus);

    const premium = new PremiumController(page, globalEventBus);

    router.add('/feed', feed);
    router.add('/auth', auth);
    router.add('/signup', signup);
    router.add('/settings', settings);
    router.add('/messages', messenger);
    router.add('/admin/statistics', statistics);
    router.add('/admin/auth', admin);
    router.add('/admin/complaints', complaints);
    router.add('/premium', premium);

    if (!window.location.pathname.startsWith('/admin')) {
        await auth.model.isAuthorisedGlobalAsync();
    } else {
        admin.model.isAuthorised();
    }

    router.start();
});
