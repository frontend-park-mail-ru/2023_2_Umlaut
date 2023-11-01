import {SETTINGS_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS_EVENTS.SEND_DATA, this.sendForm.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
        this.settings = {
            goals:[
                "Серьезные отношения",
                "Несерьезные отношения",
                "Новые знакомства",
            ],
            educations:[
                "Высшее",
                "Среднее",
                "Неоконченное высшее",
                "Среднее специальное",
            ],
            interests:[
                "Баскетбол",
                "Боулинг",
                "Бильярд",
                "Банджо",
                "Большой теннис",
            ],
            tags:[
                "Кошки",
                "Собаки",
                "Тусовки",
                "Музыка"
            ]
        }
    }

    sendForm(data) {
        this.settings.user.looking = data.looking;
        this.settings.user.hobbies = data.hobbies;
        this.settings.user.education = data.education;
        this.settings.user.tags = data.tags;
        this.settings.user.description = data.description;
        this.settings.user.name = data.name;
        this.settings.user.age = Number(data.age);
        this.settings.user.user_gender = data.user_gender;
        this.settings.user.prefer_gender = data.prefer_gender;
        this.settings.user.mail = data.mail;
        this.settings.user.password = data.password;
        Api.update(this.settings.user).then(
            (response) => {
                if (response.status === 200) {
                    this.eventBus.emit(SETTINGS_EVENTS.SUCCESS);
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
        Api.user().then(
            (response) => {
                if ( response.status === 200 ) {
                    this.settings.user=response.payload;
                    this.eventBus.emit(SETTINGS_EVENTS.GOT_USER, this.settings);
                } else {
                    this.eventBus.emit(SETTINGS_EVENTS.UNAUTH);
                }
            },
        );
    }
}
