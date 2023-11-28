/**
 * Пути запросов к бекэнду
 */
export const URLS = {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    Signup: '/api/v1/auth/sign-up',
    user: '/api/v1/user',
    feed: '/api/v1/feed?',
    photo: '/api/v1/user/photo',
    dialogs: '/api/v1/dialogs',
    like: '/api/v1/like',
    csat: '/api/v1/show-csat',
    rateAll: '/api/v1/feedback',
    adminAuth: '/api/v1/auth/admin',
    feedback: '/api/v1/admin/feedback',
    feedFeedback: '/api/v1/admin/feed-feedback',
    remomendations: '/api/v1/admin/recomendation',
    feedbackPost: '/api/v1/feedback',
    remomendationsPost: '/api/v1/recomendation',
    getTags: '/api/v1/tag',
    complaint: '/api/v1/complaint',
    adminComplaint: '/api/v1/admin/complaint',
};

export const SETTINGS_LIST = {
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
    interests: undefined,
};

export const COMPLAIN_TYPES = [
    {
        'id': '1',
        'name': 'Порнография',
    },
    {
        'id': '2',
        'name': 'Рассылка спама',
    },
    {
        'id': '3',
        'name': 'Оскорбительное поведение',
    },
    {
        'id': '4',
        'name': 'Мошенничество',
    },
    {
        'id': '5',
        'name': 'Рекламная страница',
    },
    {
        'id': '6',
        'name': 'Клон моей страницы (или моя старая страница)',
    },
];

/**
 * Сслыка на бекэнд
 */
export const BACKEND_URL = 'https://umlaut-bmstu.me';

export const DEFAULT_PHOTO = '/pics/avatar.png';

export const GLOBAL_EVENTS = {
    REDIRECT: 'Redirect',
    UNAUTH: 'Unauthorised',
    NETWORK_ERROR: 'NetworkError',
    AUTH: 'Authorised',
    CHECK_AUTHORISED: 'CheckIsAuthorised',
    RERENDER_HEADER: 'Rerender',
    POPUP: 'Popup',
    POPUP_CONFIRM: 'Confirm',
    POPUP_CHOOSE: 'Choose',
    OFFLINE: 'Offline',
    ONLINE: 'Online',
};

export const AUTH_EVENTS = {
    INVALID_AUTH: 'InvalidAuth',
    SIGN_IN: 'SignIn',
    SIGN_UP: 'Signup',
    INVALID_SignuP: 'InvalidSignup',
    CHECK_AUTHORISED: 'CheckIsAuthorised',
};

export const FEED_EVENTS = {
    RATE_PERSON: 'RatePerson',
    NO_PEOPLE: 'NoPeople',
    NEXT_PERSON_READY: 'NextPerson',
    GET_PERSON: 'GetPerson',
    MUTUAL: 'MutualLikes',
    COMPLAIN_PERSON: 'Complain',
};

export const SETTINGS_EVENTS = {
    CHECK_AUTHORISED: 'CheckIsAuthorised',
    GOT_USER: 'RenderingHeader',
    SEND_DATA: 'g',
    SUCCESS: 'JJ',
    DELETE_PHOTO: 'DeletePhoto',
    PHOTO_DELETED: 'PhotoDeleted',
    ADD_PHOTO: 'AddPhoto',
    PHOTO_UPLOADED: 'photo',
    LOGOUT: 'Logout',
    SHOW_CONFIRM_LOG: 'ShowConfirm',
};

export const MESSENGER_EVENTS = {
    GET_DIALOGS: 'GetDialogs',
    GET_PAIRS: 'GetPairs',
    DIALOGS_READY: 'DialogsReady',
    PAIRS_READY: 'PairsReady',
    GET_MESSAGES: 'GetMessages',
    MESSAGES_READY: 'MessagesReady',
    SEND_MESSAGE: 'SendMessage',
    PAIRS_EMPTY: 'EmptyPairs',
    NEW_MESSAGE_IN_THIS_DIALOG: 'll',
    MARK_AS_READ: 'lkjh',
};

export const POPUP_EVENTS = {
    CLOSE: 'close',
    YES: 'yes',
    NO: 'no',
    SHOW_CONFIRM: 'uuu',
};

export const COMPLAINTS_EVENTS = {
    GET_COMPLAINT: 'Get',
    ACCEPT_COMPLAINT: 'Accept',
    DECLINE_COMPLAINT: 'Decline',
    COMPLAINT_READY: 'Ready',
};

export const CSAT_EVENTS = {
};

export const STAT_EVENTS = {
    GET_STAT: 'jnjnjnjnj',
    STAT_READY: 'gjfnjtnn',
};

export const COMMON_EVENTS = {
    UNAUTH: 'Unauthorised',
    NETWORK_ERROR: 'NetworkError',
    AUTH: 'Auth',
};

export const CSAT_URL = '/csat/';
