import { Csat } from "./components/Welcome/Csat.js";

document.addEventListener('DOMContentLoaded', ()=>{
    const root = document.querySelector('.csat-place'); 
    const csat = new Csat(root);
    csat.renderGeneral();
});