/**
 * Контроллер переходов по страницам
 */
export class Router {
    /**
     * Конструктор класса Router
     * @constructor
     * @param {Map<string, function>} routes - путь и функция рендера страницы
     */
    constructor(routes = new Map) {
        this.routes = routes;
        this.current = null;
    }

    /**
     * Переход по ссылкам в spa приложении с заполнением history.api
     * @param {string} path - путь
     */
    go(path) {
        if (this.current === path) return;
        this.current = path;
        if (!this.routes.has(path)) {
            this.change('/');
            return;
        }
        window.history.pushState(null, null, path);
        this.change(path);
    }

    /**
     * Переход по ссылке без заполнения history.api
     * @param {string} path
     */
    change(path) {
        this.routes.get(path)();
        this.current = path;
    }

    /**
     * Добавление нового url
     * @param {string} path
     * @param {function} callback
     */
    add(path, callback) {
        this.routes.set(path, callback);
    }

    /**
     * Обеспечивает переход по ссылкам в теге <a></a> и переходы по истории (с помощью стрелок в браузере)
     */
    start() {
        document.addEventListener('click', (evt) => {
            const linkElement = evt.target.closest('a');
            if (linkElement) {
                evt.preventDefault();
                this.go(linkElement.pathname);
            }
        });

        window.addEventListener('popstate', () => {
            this.change(window.location.pathname);
        });

        this.go(window.location.pathname);
    }
}
