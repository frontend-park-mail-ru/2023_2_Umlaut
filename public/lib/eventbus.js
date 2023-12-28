export class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (listener) => listener !== callback,
            );
        }
    }

    emit(event, data = {}) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach((listener) => {
            try {
                listener(data);
            } catch (e) {
                // console.log("error");
            }
        });
    }
}
