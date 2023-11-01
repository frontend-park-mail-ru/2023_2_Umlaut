export const GLOBAL_EVENTS = {
    REDIRECT: 'Redirect',
    UNAUTH: 'Unauthorised',
    NETWORK_ERROR: 'NetworkError',
    AUTH: 'Authorised',
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
    NEXT_PERSON_READY: 'NextPerson',
    // надо подумать и сделать rate и get_next отдельными, либо отлавливать это в модели
    // например мы рейт персон и у нас метч надо отправить это в фид
    UNAUTH: 'Unauthorised',
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
    DELETE_PHOTO: "DeletePhoto"
};

export const MESSENGER_EVENTS = {
    GET_DIALOGS: "GetDialogs",
    DIALOGS_READY: "DialogsReady",
    GET_MESSAGES: "GetMessages",
    MESSAGES_READY: "MessagesReady",
    SEND_MESSAGE: "SendMessage"
};
