"use strict";


import { Router } from "./modules/router.js";
import { Auth } from "./components/Auth/Auth.js";


let router = new Router();

let auth = new Auth(document.getElementById("root"), () => router.go("/feed"))

router.add("/auth", () => auth.render())

router.start()