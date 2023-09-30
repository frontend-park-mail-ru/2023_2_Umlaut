"use strict";


import { Router } from "./modules/router.js";
import { Auth } from "./components/Auth/Auth.js";
import { Signup } from "./components/Signup/Signup.js";
import { Header } from "./components/Header/Header.js";


let router = new Router();

let auth = new Auth(document.getElementById("root"), () => router.go("/feed"))
let signup = new Signup(document.getElementById("root"), () => router.go("/feed"))
let header = new Header(() => router.go("/feed"), () => router.go("/auth"), () => router.go("/signup"), () => router.go("/profile"))

router.add("/feed", () => header.render())
router.add("/auth", () => auth.render())
router.add("/signup", () => signup.render())

router.start()