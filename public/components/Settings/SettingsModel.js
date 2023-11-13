import {SETTINGS_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS_EVENTS.SEND_DATA, this.sendForm.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.ADD_PHOTO, this.addPhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.DELETE_PHOTO, this.deletePhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.LOGOUT, this.logout.bind(this));
        this.settings = {
            goals: [
                'Серьезные отношения',
                'Несерьезные отношения',
                'Новые знакомства',
            ],
            educations: [
                'Высшее',
                'Среднее',
                'Неоконченное высшее',
                'Среднее специальное',
            ],
            interests: [
                'Баскетбол',
                'Боулинг',
                'Бильярд',
                'Банджо',
                'Большой теннис',
            ],
            tags: [
                'Кошки',
                'Собаки',
                'Тусовки',
                'Музыка',
            ],
        };
    }

    sendForm(data) {
        this.settings.user.looking = data.looking;
        this.settings.user.hobbies = data.hobbies;
        this.settings.user.education = data.education;
        // this.settings.user.tags = data.tags;
        this.settings.user.description = data.description;
        this.settings.user.name = data.name;
        this.settings.user.birthday = data.birthday;
        this.settings.user.user_gender = data.user_gender;
        this.settings.user.prefer_gender = data.prefer_gender;
        this.settings.user.mail = data.mail;
        this.settings.user.password = data.password;
        Api.update(this.settings.user).then(
            (response) => {
                if (response.status === 200) {
                    this.eventBus.emit(SETTINGS_EVENTS.SUCCESS);
                } else {
                    this.eventBus.emit(SETTINGS_EVENTS.ERROR, response.message);
                }
            },
        );
    }

    isAuthorised() {
        Api.user().then(
            (response) => {
                if ( response.status === 200 ) {
                    this.settings.user = response.payload;
                    this.settings.user.hasPreferGender = this.settings.user.prefer_gender !== null;
                    this.settings.user.hasGender = this.settings.user.user_gender !== null;
                    if (this.settings.user.birthday !== null) {
                        this.settings.user.birthday = this.settings.user.birthday.slice(0, 10);
                    }
                    this.settings.user.photo = '/pics/avatar.png';
                    if(this.settings.user.image_path){
                        Api.getUserPhotoUrl(this.settings.user.id).then(
                            (image)=>{
                                this.settings.user.photo = image;
                            },
                        );
                    }
                    this.eventBus.emit(SETTINGS_EVENTS.GOT_USER, this.settings);
                } else {
                    this.eventBus.emit(SETTINGS_EVENTS.UNAUTH);
                }
            },
        );
    }

    addPhoto(file) {
        Api.addPhoto(file).then(
            (response) => {
                if ( response.status === 200 ) {
                    Api.getUserPhotoUrl(this.settings.user.id).then(
                        (image) => {
                            this.settings.user.photo = image;
                            this.eventBus.emit(SETTINGS_EVENTS.PHOTO_UPLOADED, image);
                        },
                    );
                }
            },
        );
    }

    deletePhoto() {
        if(this.settings.user.photo !== '/pics/avatar.png'){
            Api.deletePhoto().then(
                (response) => {
                    if ( response.status === 200 ) {
                        this.settings.user.photo = '/pics/avatar.png';
                        this.eventBus.emit(SETTINGS_EVENTS.PHOTO_UPLOADED, '/pics/avatar.png');
                    }
                },
            );
        }
    }

    logout() {
        Api.logout().then(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(SETTINGS_EVENTS.UNAUTH);
                }
            },
        );
    }
}
