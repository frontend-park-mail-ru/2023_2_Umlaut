/**
 * Класс ajax вызовов
 */

export class Ajax {
    static _csrfToken = ""
    /**
     * Get-запрос на бекенд
     * @param {string} url - путь запроса
     * @return {Promise} - статус и тело ответа
     */
    static get(url = '') {
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        })
            .then(
                (response) => {
                    const csrfToken = response.headers.get('X-Csrf-Token');
                    if (csrfToken) {
                        this._csrfToken = csrfToken;
                    }
                    const contentType = response.headers.get('content-type');
                    if ( contentType && contentType.indexOf('application/json') !== -1 ) {
                        return response.json();
                    } else {
                        return Promise.resolve(null);
                    }
                },
                (error) => {
                    console.error(error); // ошибка отправки
                },
            )
            .then((body) => {
                return body;
            },
            );
    }

    static delete(url = '') {
        return fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': this._csrfToken
            }
        })
            .then(
                (response) => {
                    const contentType = response.headers.get('content-type');
                    if ( contentType && contentType.indexOf('application/json') !== -1 ) {
                        return response.json();
                    } else {
                        return Promise.resolve(null);
                    }
                },
                (error) => {
                    console.error(error); // ошибка отправки
                },
            )
            .then((body) => {
                return body;
            },
            );
    }

    /**
     * Post-запрос на бекенд
     * @param {string} url - путь запроса
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static post(url = '', data = {}) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': this._csrfToken
            },
            body: JSON.stringify(data),
        })
            .then(
                (response) => {
                    const contentType = response.headers.get('content-type');
                    if ( contentType && contentType.indexOf('application/json') !== -1 ) {
                        return response.json();
                    } else {
                        return Promise.resolve(null);
                    }
                },
                (error) => {
                    return (error); // ошибка отправки
                },
            )
            .then((body) => {
                return body;
            },
            );
    }

    /**
     * Post-запрос на бекенд
     * @param {string} url - путь запроса
     * @param {object} data - тело запроса
     * @return {Promise} - статус и тело ответа
     */
    static postFile(url = '', data = {}) {
        const formdata = new FormData();
        formdata.append('file', data);
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': this._csrfToken
            },
            body: formdata,
        })
            .then(
                (response) => {
                    const contentType = response.headers.get('content-type');
                    if ( contentType && contentType.indexOf('application/json') !== -1 ) {
                        return response.json();
                    } else {
                        return Promise.resolve(null);
                    }
                },
                (error) => {
                    return (error); // ошибка отправки
                },
            )
            .then((body) => {
                return body;
            },
            );
    }
}
