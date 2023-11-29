/**
 * Контроллер переходов по страницам
 */
export class Router {
    /**
     * Конструктор класса Router
     * @constructor
     * @param {Map<string, object>} components - компонент страницы
     */
    constructor(components = new Map) {
        this.components = components;
        this.current = null;
    }

    /**
     * Переход по ссылкам в spa приложении с заполнением history.api
     * @param {string} path - путь
     */
    go(path) {
        if (this.current === path) return;

        if (!this.components.has(path)) {
            if (window.location.pathname.startsWith('/admin')) {
                this.go('/admin/complaints');
            } else {
                this.change('/');
            }
            return;
        }
        window.history.pushState(null, null, path);
        this.change(path);
    }

    /**
     * Переход по ссылкам в spa приложении с удалением из history.api текущего пути
     * @param {string} path - путь
     */
    goOnlyForward(path) {
        if (this.current === path) return;

        if (!this.components.has(path)) {
            this.change('/');
            return;
        }
        window.history.replaceState(null, '', path);
        this.change(path);
    }


    /**
     * Переход по ссылке без заполнения history.api
     * @param {string} path
     */
    change(path) {
        if (this.current !== null && this.components.has(this.current)) {
            this.components.get(this.current).close();
        }
        this.components.get(path).render();
        this.current = path;
    }

    /**
     * Добавление нового url
     * @param {string} path
     * @param {function} component
     */
    add(path, component) {
        this.components.set(path, component);
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
