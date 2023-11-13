/**
 * Пути запросов к бекэнду
 */
export const URLS = {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    Signup: '/api/v1/auth/sign-up',
    user: '/api/v1/user',
    feed: '/api/v1/feed',
    photo: '/api/v1/user/photo',
    dialogs: '/api/v1/dialogs',
    like: '/api/v1/like',
};

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
    RERENDER_HEADER: 'Rerender',
    POPUP:'popup',
    POPUP_CONFIRM: 'jsjs'
};

export const AUTH_EVENTS = {
    INVALID_AUTH: 'InvalidAuth',
    AUTH: 'SignedIn',
    UNAUTH: 'Unauthorised',
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
    UNAUTH: 'Unauthorised',
    MUTUAL: 'MutualLikes',
};

export const HEADER_EVENTS = {
    CHECK_AUTHORISED: 'CheckIsAuthorised',
    RENDER: 'RenderingHeader',
    AUTH: 'g',
    UNAUTH: 'k',
};

export const SETTINGS_EVENTS = {
    CHECK_AUTHORISED: 'CheckIsAuthorised',
    GOT_USER: 'RenderingHeader',
    SEND_DATA: 'g',
    UNAUTH: 'k',
    SUCCESS: 'JJ',
    DELETE_PHOTO: 'DeletePhoto',
    ADD_PHOTO: 'AddPhoto',
    PHOTO_UPLOADED: 'photo',
    LOGOUT: 'Logout',
};

export const MESSENGER_EVENTS = {
    GET_DIALOGS: 'GetDialogs',
    GET_PAIRS: 'GetPairs',
    DIALOGS_READY: 'DialogsReady',
    PAIRS_READY: 'PairsReady',
    GET_MESSAGES: 'GetMessages',
    MESSAGES_READY: 'MessagesReady',
    SEND_MESSAGE: 'SendMessage',
    UNAUTH: 'Unauth',
    PAIRS_EMPTY: 'EmptyPairs',
};

export const POPUP_EVENTS = {
    CLOSE: 'close',
    YES: 'yes',
    NO: 'no',
    SHOW_CONFIRM: 'uuu',
};
