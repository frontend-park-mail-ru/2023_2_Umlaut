import {Ajax} from './ajax.js';

const URLS = {
    login: '/auth/login',
    logout: '/auth/logout',
    singup: '/auth/sign-up',
    user: '/api/user',
    feed: '/api/feed',
};

const BACKEND_URL = 'http://37.139.32.76:8000';

export class Api {
    /**
     * Post-запрос на вход в аккаунт
     * @param {object} data - тело запроса
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static login(data = {}) {
        return Ajax.post(BACKEND_URL + URLS.login, data);
    }

     /**
     * Get-запрос на выход из аккаунта пользователя
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static logout() {
        return Ajax.get(BACKEND_URL + URLS.logout);
    }

    /**
     * Post-запрос на регистрацию нового аккаунта
     * @param {object} data - тело запроса
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static signup(data = {}) {
        return Ajax.post(BACKEND_URL + URLS.singup, data);
    }

     /**
     * Get-запрос на получение случайного пользователя для ленты
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static feed() {
        return Ajax.get(BACKEND_URL + URLS.feed);
    }

    /**
     * Get-запрос на получение пользователя, в аккаунт которого выполнен вход
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static user() {
        return Ajax.get(BACKEND_URL + URLS.user);
    }
}
