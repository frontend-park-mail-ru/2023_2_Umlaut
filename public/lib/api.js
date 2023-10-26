import {Ajax} from './ajax.js';


/**
 * Пути запросов к бекэнду
 */
const URLS = {
    login: '/auth/login',
    logout: '/auth/logout',
    Signup: '/auth/sign-up',
    user: '/api/user',
    feed: '/api/feed',
};

/**
 * Сслыка на бекэнд
 */
const BACKEND_URL = 'http://umlaut-bmstu.me:8000';

/**
 * Класс методов API
 */
export class Api {
    /**
     * Post-запрос на вход в аккаунт
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static login(data = {}) {
        return Ajax.post(BACKEND_URL + URLS.login, data);
    }

    /**
     * Get-запрос на выход из аккаунта пользователя
     * @return {Promise} - статус и тело ответа
     */
    static logout() {
        return Ajax.get(BACKEND_URL + URLS.logout);
    }

    /**
     * Post-запрос на регистрацию нового аккаунта
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static signup(data = {}) {
        return Ajax.post(BACKEND_URL + URLS.Signup, data);
    }

    /**
     * Get-запрос на получение случайного пользователя для ленты
     * @return {Promise} - статус и тело ответа
     */
    static feed() {
        return Ajax.get(BACKEND_URL + URLS.feed);
    }

    /**
     * Get-запрос на получение пользователя, в аккаунт которого выполнен вход
     * @return {Promise} - статус и тело ответа
     */
    static user() {
        return Ajax.get(BACKEND_URL + URLS.user);
    }
}
