export class EventEmitter {
    constructor() {
        this._events = {};
        this._enable = true;
    }

    emit(eventName, event) {
        if(!this._enable)
            return;
        if (!this._events[eventName]) {
            return;
        }

        this._events[eventName].forEach(callback => callback(event));
    }

    setEnable(e) {
        this._enable = e;
    }

    on(eventName, fn) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(fn);
        return this
    }

    off(eventName, fnToRemove) {
        if (!this._events[eventName]) {
            return;
        }

        this._events[eventName] = this._events[eventName].filter(fn => fn !== fnToRemove);
        return this
    }

    destroy() {
        for (const eventName in this._events) {
            if (this._events.hasOwnProperty(eventName) && Array.isArray(this._events[eventName])) {
                this._events[eventName].forEach(callback => this.off(eventName, callback));
            }
        }
        this._events.length = 0;
    }
}