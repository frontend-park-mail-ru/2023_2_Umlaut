import { Csat } from "./components/Welcome/Csat.js";

document.addEventListener('DOMContentLoaded', ()=>{
    const root = document.querySelector('.csat-place'); 
    const csat = new Csat(root);
    window.addEventListener('message', (message)=>{
        if (message.origin !== window.location.origin) {
            return;
        }
        if(message.data==='1'){
            csat.renderAboutAll();
        }else if(message.data==='2'){
            csat.renderReccomendToFriend();
        }else if(message.data==='3'){
            csat.renderAboutFeed();
        }
    });
});