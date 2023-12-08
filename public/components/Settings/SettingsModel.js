import {COMMON_EVENTS, SETTINGS_EVENTS, SETTINGS_LIST} from '../../lib/constansts.js';
import {Api, handleStatuses, loadTags} from '../../lib/api.js';

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS_EVENTS.SEND_DATA, this.sendForm.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.ADD_PHOTO, this.addPhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.DELETE_PHOTO, this.deletePhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.LOGOUT, this.logout.bind(this));
        this.settings = SETTINGS_LIST;
    }

    sendForm(data) {
        this.settings.user.looking = data.looking;
        this.settings.user.hobbies = data.hobbies;
        this.settings.user.education = data.education;
        this.settings.user.tags = data.tags;
        this.settings.user.description = data.description;
        this.settings.user.name = data.name;
        this.settings.user.birthday = data.birthday;
        this.settings.user.user_gender = data.user_gender;
        this.settings.user.prefer_gender = data.prefer_gender;
        this.settings.user.mail = data.mail;
        this.settings.user.password = data.password;
        Api.update(this.settings.user).then(handleStatuses(
            (response) => {
                if (response.status === 200) {
                    this.eventBus.emit(SETTINGS_EVENTS.SUCCESS, 'Данные успешно сохранены!');
                }
            },
            this.eventBus));
    }

    isAuthorised() {
        this.eventBus.emit(SETTINGS_EVENTS.GOT_USER, this.settings);
        Api.user().then( handleStatuses(
            async (response) => {
                if ( response.status === 200 ) {
                    this.settings.user = response.payload;
                    this.settings.tags = [];
                    this.settings.user.tags.forEach((element) => {
                        this.settings.tags.push(element);
                    });
                    if (!SETTINGS_LIST.interests) {
                        await loadTags(this.eventBus);
                    }
                    this.settings.user.hasPreferGender = this.settings.user.prefer_gender !== null;
                    this.settings.user.hasGender = this.settings.user.user_gender !== null;
                    if (this.settings.user.birthday !== null) {
                        this.settings.user.birthday = this.settings.user.birthday.slice(0, 10);
                    }

                    this.eventBus.emit(SETTINGS_EVENTS.GOT_USER, this.settings);
                }
            },
            this.eventBus),
        );
    }

    addPhoto(file) {
        Api.addPhoto(file).then( handleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(SETTINGS_EVENTS.PHOTO_UPLOADED, response.payload);
                }
            },
            this.eventBus),
        );
    }

    deletePhoto(photo) {
        Api.deletePhoto(photo).then( handleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(SETTINGS_EVENTS.PHOTO_DELETED, photo);
                }
            },
            this.eventBus),
        );
    }

    logout() {
        Api.logout().then( handleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.eventBus.emit(COMMON_EVENTS.UNAUTH);
                }
            },
            this.eventBus),
        );
    }
}
