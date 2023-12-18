import {Ajax} from './ajax.js';
import {COMMON_EVENTS, URLS} from './constansts.js';
import {BACKEND_URL, SETTINGS_LIST} from './constansts.js';

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
     * @param {Object} data - query параметры запросы
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
     * Get-запрос на получение пользователя по Id
     * @param {Int} id - id пользователя
     * @return {Promise} - статус и тело ответа
     */
    static getUserById(id) {
        return Ajax.get(BACKEND_URL + URLS.user + '/' + id);
    }

    /**
     * Get-запрос на получение диалогов
     * @return {Promise} - статус и тело ответа
     */
    static getPairs() {
        return Ajax.get(BACKEND_URL + URLS.dialogs);
    }

    /**
     * Post-запрос на добавление новой фотографии
     * @param {object} data - файл с фото
     * @return {Promise} - статус и тело ответа
     */
    static addPhoto(data) {
        return Ajax.postFile(BACKEND_URL + URLS.photo, data);
    }

    /**
     * Delete-запрос на удаление фото
     * @param {string} photo - ссылка на удаляемое фото
     * @return {Promise} - статус и тело ответа
     */
    static deletePhoto(photo) {
        return Ajax.delete(BACKEND_URL + URLS.photo, {link: photo});
    }

    /**
     * Post-запрос оценки пользователя (лайк/дизлайк)
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static addLike(data) {
        return Ajax.post(BACKEND_URL + URLS.like, data);
    }

    /**
     * Get-запрос на получение разрешения показать ксат-опрос про весь сайт
     * @return {Promise} - статус и тело ответа
     */
    static csat() {
        return Ajax.get(BACKEND_URL + URLS.csat);
    }

    /**
     * Post-запрос на отправку данных с ксата оценки всего сайта
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static rateAll(data) {
        return Ajax.post(BACKEND_URL + URLS.rateAll, data);
    }

    /**
     * Post-запрос на вход администратора
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static admimAuth(data) {
        return Ajax.post(BACKEND_URL + URLS.adminAuth, data);
    }

    /**
     * Get-запрос на получение разрешения показа ксата про ленту
     * @return {Promise} - статус и тело ответа
     */
    static feedback() {
        return Ajax.get(BACKEND_URL + URLS.feedback);
    }

    static recomendation() {
        return Ajax.get(BACKEND_URL + URLS.remomendations);
    }

    /**
     * Post-запрос на отправку данных с ксата оценки ленты
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static rateFeed(data) {
        return Ajax.post(BACKEND_URL + URLS.feedFeedbackPost, data);
    }

    /**
     * Post-запрос на отправку данных с ксата рекомендации друзьям
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static recomendFriend(data) {
        return Ajax.post(BACKEND_URL + URLS.remomendationsPost, data);
    }

    /**
     * Get-запрос на получение тегов
     * @return {Promise} - статус и тело ответа
     */
    static getTags() {
        return Ajax.get(BACKEND_URL + URLS.getTags);
    }

    /**
     * Post-запрос на отправку жалобы
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static complaint(data) {
        return Ajax.post(BACKEND_URL + URLS.complaint, data);
    }

    /**
     * Get-запрос на получение сообщений из диалога
     * @param {Int} id - id нужного диалога
     * @return {Promise} - статус и тело ответа
     */
    static getMessages(id) {
        return Ajax.get(BACKEND_URL + URLS.dialogs + '/' + id + '/message');
    }

    /**
     * Get-запрос на получение анкеты на которую пожаловались с панели администратора
     * @return {Promise} - статус и тело ответа
     */
    static getComplaint() {
        return Ajax.get(BACKEND_URL + URLS.adminComplaint);
    }

    /**
     * Get-запрос на одобрение жалобы с панели администратора
     * @param {Int} id - id пользователя, на которого пожаловались
     * @return {Promise} - статус и тело ответа
     */
    static acceptComplaint(id) {
        return Ajax.get(BACKEND_URL + URLS.adminComplaint + '/' + id);
    }

    /**
     * Delete-запрос на отмену жалобы с панели администратора
     * @param {Int} id - id пользователя, на которого пожаловались
     * @return {Promise} - статус и тело ответа
     */
    static declineComplaint(id) {
        return Ajax.delete(BACKEND_URL + URLS.adminComplaint + '/' + id);
    }

    /**
     * Get-запрос на получение пользователя по id
     * @param {Int} id - id пользователя
     * @return {Promise} - статус и тело ответа
     */
    static getUser(id) {
        return Ajax.get(BACKEND_URL + URLS.user + '/' + id);
    }

    /**
     * Get-запрос на получение данных о диалоге по id
     * @param {Int} id - id диалога
     * @return {Promise} - статус и тело ответа
     */
    static getDialogById(id) {
        return Ajax.get(BACKEND_URL + URLS.dialogs + '/' + id);
    }

    /**
     * Get-запрос на получение пользователей, лайкнувших текущего
     * @return {Promise} - статус и тело ответа
     */
    static getLiked() {
        return Ajax.get(BACKEND_URL + URLS.getLiked);
    }

    /**
     * Get-запрос на получение реферальной пригласительной ссылки
     * @return {Promise} - статус и тело ответа
     */
    static getLink() {
        return Ajax.get(BACKEND_URL + URLS.getLink);
    }
}

/**
 * Обертка над функциями класса апи, сразу пробрасывающая ошибки с общим поведением
 * @param {Object} func - функция, которую оборачиваем
 * @param {Object} eventBus - шина для обработки ошибок
 * @return {Object} - результат выполнения функции
 */
export function handleStatuses(func, eventBus) {
    return (response) => {
        if (response.status === 401) {
            eventBus.emit(COMMON_EVENTS.UNAUTH);
        } else if (response.status === 403) {
            eventBus.emit(COMMON_EVENTS.USER_BANNED);
        } else if (response.status >= 500) {
            eventBus.emit(COMMON_EVENTS.NETWORK_ERROR);
        } else {
            return func(response);
        }
    };
}

/**
 * Получить теги
 * @param {Object} eventBus - шина для обработки ошибок
 */
export async function loadTags(eventBus) {
    await Api.getTags().then(handleStatuses((response) =>{
        if (response.status !== 200) {
            eventBus.emit(COMMON_EVENTS.NETWORK_ERROR);
            return;
        }
        SETTINGS_LIST.interests = {};
        let counter = 0;
        response.payload.forEach((el) => {
            SETTINGS_LIST.interests[el] = 'tag_' + counter;
            counter++;
        });
    }), eventBus);
}
