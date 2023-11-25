import {AUTH_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';

export class AdminAuthModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(AUTH_EVENTS.SIGN_IN, this.signIn.bind(this));
        this.eventBus.on(AUTH_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
    }

    signIn(data) {
        Api.admimAuth(data).then(
            (response) => {
                if (response.status === 200) {
                    this.eventBus.emit(AUTH_EVENTS.AUTH);
                } else if (response.status === 400) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неправильный запрос'});
                } else if (response.status === 404) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Страница не найдена'});
                } else if (response.status === 401) {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Невeрный email или пароль'});
                } else {
                    this.eventBus.emit(AUTH_EVENTS.INVALID_AUTH, {message: 'Неожиданная ошибка'});
                }
            },
        );
    }

    isAuthorised() {
        Api.recomendation().then(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(AUTH_EVENTS.AUTH);
                } else {
                    this.eventBus.emit(AUTH_EVENTS.UNAUTH);
                }
            },
        );
    }
}
