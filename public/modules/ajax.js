
export class Ajax {
    /**
     * Get-запрос на бекенд
     * @param {string} url - путь запроса
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static get(url = '') {
        let status;

        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
            .then(
                (response) => {
                    status = response.status;
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
                return {
                    status,
                    body,
                };
            });
    }

    /**
     * Post-запрос на бекенд
     * @param {string} url - путь запроса
     * @param {object} data - тело запроса
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static post(url = '', data = {}) {
        let status;

        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(
                (response) => {
                    status = response.status;
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
                return {
                    status,
                    body,
                };
            });
    }


    /**
     * Post-запрос на бекенд без тела запроса
     * @param {string} url - путь запроса
     * @param {object} data - тело запроса
     * @returns {Object{status, body}} - статус и тело ответа
     */
    static postNoBody(url = '', data = {}) {
        let status;

        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(
                (response) => {
                    status = response.status;
                    return {
                        status,
                    };
                },
                (error) => {
                    return (error); // ошибка отправки
                },
            );
    }
}
