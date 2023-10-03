import { Ajax } from "./ajax.js";

const URLS = {
    login: "/auth/login",
    logout: "/auth/logout",
    singup: "/auth/sign-up",
    user: "/api/user",
    feed: "/api/feed",
  };
  
const BACKEND_URL = "http://37.139.32.76:8000";

export class Api{
    static login(data={}){
        return Ajax.post(BACKEND_URL + URLS.login, data);
    }

    static logout(){
        return Ajax.get(BACKEND_URL + URLS.logout)
    }

    static signup(data={}){
        return Ajax.post(BACKEND_URL + URLS.singup, data)
    }

    static feed(data={}){
        return Ajax.get(BACKEND_URL + URLS.feed)
    }

    static user(){
        Ajax.get(BACKEND_URL + URLS.user)
    }

}