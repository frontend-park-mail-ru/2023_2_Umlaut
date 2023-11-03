import {Ajax} from './ajax.js';


/**
 * Пути запросов к бекэнду
 */
const URLS = {
    login: '/auth/login',
    logout: '/auth/logout',
    Signup: '/auth/sign-up',
    user: '/api/v1/user',
    feed: '/api/v1/feed',
    photo: '/api/v1/user/photo',
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
     * Post-запрос на обновление полей юзера
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static update(data = {}) {
        return Ajax.post(BACKEND_URL + URLS.user, data);
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

    /**
     * Get-запрос на получение фото 
     * @return {Promise} - статус и тело ответа
     */
    static getPhoto() {
        return Ajax.get(BACKEND_URL + URLS.photo);
    }

    /**
     * Get-запрос на добавление фото 
     * @return {Promise} - статус и тело ответа
     */
    static addPhoto(data) {
        return Ajax.postFile(BACKEND_URL + URLS.photo, data);
    }

    /**
     * Get-запрос на удаление фото 
     * @return {Promise} - статус и тело ответа
     */
    static deletePhoto() {
        return Ajax.delete(BACKEND_URL + URLS.photo);
    }
}
