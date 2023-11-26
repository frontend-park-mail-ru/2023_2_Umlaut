/**
 * Класс ajax вызовов
 */

export class Ajax {
    static _csrfToken = '';
    /**
     * Get-запрос на бекенд
     * @param {string} url - путь запроса
     * @return {Promise} - статус и тело ответа
     */
    static getCsrf(url = '') {
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
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
                    console.error(error);
                    return Promise.resolve({status: 512});
                },
            );
    }

    static get(url = '') {
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
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
                    console.error(error);
                    return Promise.resolve({status: 512});
                },
            );
    }

    static delete(url = '', data = {}) {
        const request = {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        };
        if (!this._csrfToken && this._csrfToken !== '') {
            request.headers['X-Csrf-Token'] = this._csrfToken;
        }
        return fetch(url, request)
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
                    console.error(error);
                    return Promise.resolve({status: 512});
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
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': this._csrfToken,
            },
            body: JSON.stringify(data),
        };
        return fetch(url, request)
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
                    console.error(error);
                    return Promise.resolve({status: 512});
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
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: formdata,
        };
        if (this._csrfToken !== null && this._csrfToken !== undefined && this._csrfToken !== '') {
            request.headers = {'X-Csrf-Token': this._csrfToken};
        }
        return fetch(url, request)
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
                    console.error(error);
                    return Promise.resolve({status: 512});
                },
            );
    }
}
