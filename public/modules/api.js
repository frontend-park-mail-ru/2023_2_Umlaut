import { Ajax } from "./ajax.js";

const URLS = {
    login: "/auth/login",
    logout: "/auth/logout",
    singup: "/auth/signup",
    feed: "/api/feed",
  };
  
const BACKEND_URL = "http://localhost:8000";

export class Api{
    static login(data={}){
        return Ajax.post(BACKEND_URL + URLS.login, data);
    }

    static logout(){
        return Ajax.get(BACKEND_URL + URLS.logout)
    }

    static singup(data={}){
        return Ajax.post(BACKEND_URL + URLS.singup, data)
    }

    static feed(data={}){
        return Ajax.get(BACKEND_URL + URLS.feed)
    }

}