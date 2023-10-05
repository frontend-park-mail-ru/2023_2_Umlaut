
export class Ajax {
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
                    return(error); // ошибка отправки
                },
            )
            .then((body) => {
                return {
                    status,
                    body,
                };
            });
    }

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
                    return(error); // ошибка отправки
                },
            );
    }
}
