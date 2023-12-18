import {AUTH_EVENTS, COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';

/**
 * Класс логики по входу в аккаунт и регистрации
 */
export class AuthModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(AUTH_EVENTS.SIGN_IN, this.signIn.bind(this));
        this.eventBus.on(AUTH_EVENTS.SIGN_UP, this.signUp.bind(this));
        this.eventBus.on(AUTH_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
    }

    /**
     * Вход в аккаунт
     * @param {object} data - параметры для входа
     */
    signIn(data) {
        Api.login(data).then(
            (response) => {
                if (response.status === 200) {
                    this.isAuthorised();
                } else if (response.status === 400) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неправильный запрос'});
                } else if (response.status === 404) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Страница не найдена'});
                } else if (response.status === 403) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Вы были заблокированы'});
                } else if (response.status === 401) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Невeрный email или пароль'});
                } else {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неожиданная ошибка'});
                }
            },
        );
    }

    /**
     * Регистрация нового аккаунта
     * @param {object} data - параметры для регистрации
     */
    signUp(data) {
        const path = window.location.pathname;
        const invitedBy = path.substring(path.lastIndexOf('/')+1);
        if (invitedBy !== 'signup') {
            data.invited_by = invitedBy;
        }
        Api.signup(data).then(
            (response) => {
                switch (response.status) {
                case 200:
                    this.isAuthorised();
                    break;
                case 400:
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неправильный запрос'});
                    break;
                case 404:
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Страница не найдена'});
                    break;
                case 401:
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Невeрный email или пароль'});
                    break;
                case 414:
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неверная ссылка'});
                    break;
                default:
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неожиданная ошибка'});
                    break;
                }
            },
        );
    }

    /**
     * Проверка на то, авторизован ли пользователь
     */
    isAuthorised() {
        Api.user().then(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(COMMON_EVENTS.AUTH, response.payload);
                    if (window.location.pathname === '/auth') {
                        this.eventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed');
                    } else if (window.location.pathname === '/signup') {
                        this.eventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed');
                        this.eventBus.emit(GLOBAL_EVENTS.POPUP_SETTINGS);
                    }
                } else if (response.status === 401) {
                    this.eventBus.emit(COMMON_EVENTS.UNAUTH);
                } else if (response.status === 403) {
                    this.eventBus.emit(GLOBAL_EVENTS.USER_BANNED);
                } else if (response.status >= 500) {
                    this.eventBus.emit(COMMON_EVENTS.NETWORK_ERROR);
                }
            },
        );
    }
}
