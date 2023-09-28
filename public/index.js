"use strict";


import { Router } from "./modules/router.js";
import { Auth } from "./components/Auth/Auth.js";

let auth = new Auth(document.getElementById("root"))

let router = new Router(new Map([
    ["/auth", auth.renderAuth.bind(auth) ]
]));


router.go(window.location.pathname)