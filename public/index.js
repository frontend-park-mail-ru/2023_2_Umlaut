"use strict";


import { Router } from "./modules/router.js";
import { Auth } from "./components/Auth/Auth.js";
import { Signup } from "./components/Signup/Signup.js";
import { Header } from "./components/Header/Header.js";
import { Menu } from "./components/Menu/Menu.js";
import { Api } from "./modules/api.js";


let router = new Router();

let auth = new Auth(document.getElementById("root"), () => router.go("/feed"))
let signup = new Signup(document.getElementById("root"), () => router.go("/feed"))
let header = new Header(() => router.go("/feed"), () => router.go("/auth"), () => router.go("/signup"), () => router.go("/profile"))

const menuItems = {
    feed: {
        href: '/feed',
        name: 'Лента',
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
    },
    notifications: {
        href: '/notifications',
        name: 'Уведомления',
    },
    messages: {
        href: '/messages',
        name: 'Сообщения',
    }
};

let menu = new Menu(menuItems, () => header.render())
menu.render();

router.add("/feed", () => menu.render())
router.add("/auth", () => auth.render())
router.add("/signup", () => signup.render())
router.add("/logout", () => {Api.logout(); auth.render()})

router.start()