import {Ajax} from './ajax.js';
import {COMMON_EVENTS, URLS} from './constansts.js';
import {BACKEND_URL} from './constansts.js';

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
     * @param {Object} data
     * @return {Promise} - статус и тело ответа
     */
    static feed(data = {}) {
        return Ajax.get(BACKEND_URL + URLS.feed, data);
    }

    /**
     * Get-запрос на получение пользователя, в аккаунт которого выполнен вход
     * @return {Promise} - статус и тело ответа
     */
    static user() {
        return Ajax.getCsrf(BACKEND_URL + URLS.user);
    }

    /**
     * Get-запрос на получение диалогов
     * @return {Promise} - статус и тело ответа
     */
    static getPairs() {
        return Ajax.get(BACKEND_URL + URLS.dialogs);
    }

    static addPhoto(data) {
        return Ajax.postFile(BACKEND_URL + URLS.photo, data);
    }

    /**
     * Get-запрос на удаление фото
     * @param {string} photo - ссылка на удаляемое фото
     * @return {Promise} - статус и тело ответа
     */
    static deletePhoto(photo) {
        return Ajax.delete(BACKEND_URL + URLS.photo, {link: photo});
    }

    static addLike(data) {
        return Ajax.post(BACKEND_URL + URLS.like, data);
    }

    static csat() {
        return Ajax.get(BACKEND_URL + URLS.csat);
    }
    static rateAll(data) {
        return Ajax.post(BACKEND_URL + URLS.rateAll, data);
    }

    static admimAuth(data) {
        return Ajax.post(BACKEND_URL + URLS.adminAuth, data);
    }

    static feedback() {
        return Ajax.get(BACKEND_URL + URLS.feedback);
    }

    static feedFeedback() {
        return Ajax.get(BACKEND_URL + URLS.feedFeedback);
    }

    static recomendation() {
        return Ajax.get(BACKEND_URL + URLS.remomendations);
    }

    static rateFeed(data) {
        return Ajax.post(BACKEND_URL + URLS.feedFeedbackPost, data);
    }

    static recomendFriend(data) {
        return Ajax.post(BACKEND_URL + URLS.remomendationsPost, data);
    }
}

export function HandleStatuses(func, eventBus) {
    return (response) => {
        if (response.status === 401) {
            eventBus.emit(COMMON_EVENTS.UNAUTH);
        } else if (response.status >= 500) {
            eventBus.emit(COMMON_EVENTS.NETWORK_ERROR);
        } else {
            func(response);
        }
    };
}
