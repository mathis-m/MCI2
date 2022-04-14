import {EventEmitter} from "../event-emitter/event-emitter";

export class FSM {
    constructor(config) {
        this.enable = true;
        // Attach get-next-state function
        const states = config.states;
        if (states) {
            this.addStates(states);
        }

        // Attach extend members
        const extend = config.extend;
        if (extend) {
            for (const name in extend) {
                if (!this.hasOwnProperty(name) || this[name] === undefined) {
                    this[name] = extend[name];
                }
            }
        }

        this._stateLock = false;
        this.emitter = new EventEmitter();
        this.start(undefined);
        if(config.init)
            config.init.call(this);
    }

    shutdown() {
        this.emitter.destroy();
    }

    destroy() {
        this.shutdown();
    }

    setEnable(e) {
        if (e === undefined) {
            e = true;
        }
        this.enable = e;
        return this;
    }

    toggleEnable() {
        this.setEnable(!this.enable);
        return this;
    }

    set state(newState) {
        if (!this.enable || this._stateLock) {
            return;
        }
        if (this._state === newState) {
            return;
        }
        this._prevState = this._state;
        this._state = newState;

        this._stateLock = true; // lock state

        this.emitter.emit('statechange', this);

        if (this._prevState != null) {
            const exitEventName = 'exit_' + this._prevState;
            const exitCallback = this[exitEventName];
            if (exitCallback) {
                exitCallback.call(this);
            }
            this.emitter.emit(exitEventName, this);
        }

        this._stateLock = false;

        if (this._state != null) {
            const enterEventName = 'enter_' + this._state;
            const enterCallback = this[enterEventName];
            if (enterCallback) {
                enterCallback.call(this);
            }
            this.emitter.emit(enterEventName, this);
        }
    }

    get state() {
        return this._state;
    }

    get prevState() {
        return this._prevState;
    }

    start(state) {
        this._start = state;
        this._prevState = undefined;
        this._state = state; // Won't fire statechange events
        return this;
    }

    goto(nextState) {
        if (nextState != null) {
            this.state = nextState;
        }
        return this;
    }

    next() {
        let nextState;
        const getNextState = this['next_' + this.state];
        if (getNextState) {
            if (typeof (getNextState) === 'string') {
                nextState = getNextState;
            } else {
                nextState = getNextState.call(this);
            }
        }

        this.goto(nextState);
        return this;
    }

    addState(name, state) {
        if (typeof (name) !== 'string') {
            state = name;
            name = state.name;
        }

        const getNextStateCallback = state.next;
        if (getNextStateCallback) {
            this['next_' + name] = getNextStateCallback;
        }

        const exitCallback = state.exit;
        if (exitCallback) {
            this['exit_' + name] = exitCallback;
        }

        const enterCallback = state.enter;
        if (enterCallback) {
            this['enter_' + name] = enterCallback;
        }
        return this;
    }

    addStates(states) {
        if (Array.isArray(states)) {
            for (let i = 0; i < states.length; i++) {
                this.addState(states[i]);
            }
        } else {
            for (const name in states) {
                this.addState(name, states[name]);
            }
        }
        return this;
    }

    runMethod(methodName, a1, a2, a3, a4, a5) {
        const fn = this[methodName + '_' + this.state];
        if (!fn) {
            return undefined;
        }

        const len = arguments.length;
        switch (len) {
            case 1: return fn.call(this);
            case 2: return fn.call(this, a1);
            case 3: return fn.call(this, a1, a2);
            case 4: return fn.call(this, a1, a2, a3);
            case 5: return fn.call(this, a1, a2, a3, a4);
            case 6: return fn.call(this, a1, a2, a3, a4, a5);
        }
        const args = new Array(len - 1);
        for (let i = 1; i < len; i++) {
            args[i - 1] = arguments[i];
        }
        return fn.apply(this, args);
    }

    update(time, delta) {
        this.runMethod('update', time, delta);
    }

    preupdate(time, delta) {
        this.runMethod('preupdate', time, delta);
    }

    postupdate(time, delta) {
        this.runMethod('postupdate', time, delta);
    }
}