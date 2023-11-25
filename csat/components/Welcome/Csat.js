import { Api } from "../../../public/lib/api.js";
import "./Csat.scss"
export class Csat {
    constructor(root) {
        this.root = root;
        this.number = require('./General.hbs');
        this.choose = require('./Choose.hbs');
        this.text = require('./TextAnswer.hbs');
        this.final = require('./Final.hbs');
        this.inputValue = {};
    }

    /**
     * Рендер страницы авторизации
     */
    renderAboutAll() {
        this.root.innerHTML = this.number({text:"Оцените общее впечатление от пользования нашим сайтом"});
        const btnNext = this.root.querySelector('#take-survey');
        const rating = this.root.querySelector('#rating');
        const skip = this.root.querySelector('#skip');
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
        skip.addEventListener('click', ()=>{
            this.renderFinal();
        });
        btnNext.addEventListener('click', ()=>{
            this.inputValue.rating = rating.value;
            if(rating.value<9){
                this.renderChoose();
            }else{
                this.renderFinal();
                Api.rateAll(this.inputValue);
            }
        });
    }

    renderChoose(){
        this.root.innerHTML = this.choose({text:"Что нам стоит исправить?"});
        const btnNext = this.root.querySelector('#take-survey');
        const checkboxes = this.root.querySelectorAll('.csat__checkbox');
        const skip = this.root.querySelector('#skip');
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
        skip.addEventListener('click', ()=>{
            this.renderFinal();
        });
        btnNext.addEventListener('click', ()=>{
            this.inputValue.need_fix='';
            this.inputValue.liked='';
            checkboxes.forEach(element => {
                if(element.checked){
                    this.inputValue.need_fix+=element.id+", ";
                }else{
                    this.inputValue.liked+=element.id+", ";
                }
            });
            switch(this.inputValue.need_fix.slice(0, this.inputValue.need_fix.indexOf(","))) {
                case 'design':
                    this.renderText("дизайна");      
                    break;        
                case 'quality':  
                    this.renderText("алгоритма подбора");
                    break;
                case 'convinient':  
                    this.renderText("удобства пользования");
                    break;
                default:
                    this.renderFinal();
                    Api.rateAll(this.inputValue);
              }
        });
    }

    renderText(msg) {
        this.root.innerHTML = this.text({text:msg});
        const btnNext = this.root.querySelector('#take-survey');
        const recomendations = this.root.querySelector('#recomendations');
        const skip = this.root.querySelector('#skip');
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
        skip.addEventListener('click', ()=>{
            this.renderFinal();
        });
        btnNext.addEventListener('click', ()=>{
            this.inputValue.comment_fix = recomendations.value;
            this.renderFinal();
            Api.rateAll(this.inputValue);
        });
    }

    renderFinal(){
        this.root.innerHTML = this.final();
        setTimeout(()=>window.top.postMessage('close', window.location.origin), 3000);
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
    }

    renderAboutFeed() {
        this.root.innerHTML = this.number({text:"Оцените впечатление от пользования нашей лентой рекомендаций"});
        const btnNext = this.root.querySelector('#take-survey');
        const rating = this.root.querySelector('#rating');
        const skip = this.root.querySelector('#skip');
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
        skip.addEventListener('click', ()=>{
            this.renderFinal();
        });
        btnNext.addEventListener('click', ()=>{
            this.inputValue.rating = rating.value;
            this.renderFinal();
            Api.rateFeed(this.inputValue);
        });
    }

    renderReccomendToFriend() {
        this.root.innerHTML = this.number({text:"Насколько вероятно, что вы порекомендуете наш сервис друзьям?"});
        const btnNext = this.root.querySelector('#take-survey');
        const rating = this.root.querySelector('#rating');
        const skip = this.root.querySelector('#skip');
        const cross = this.root.querySelector('#cross');
        cross.addEventListener('click', ()=>window.top.postMessage('close', window.location.origin));
        skip.addEventListener('click', ()=>{
            this.root.innerHTML = this.final();
        });
        btnNext.addEventListener('click', ()=>{
            this.inputValue.rating = rating.value;
            this.root.innerHTML = this.final();
            Api.recomendFriend(this.inputValue);
        });
    }
}