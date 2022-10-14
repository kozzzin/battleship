class Event {
  constructor(name, callback) {
    this.name = name;
    this.handlers = this.addHandler(callback);
  }

  addHandlers(callbackArr) {
    callbackArr.forEach(this.addHandler);
  }

  addHandler(callback) {
    if (callback === undefined) return;
    if (this.handlers === undefined) return [callback];
    if (!this.handlers.includes(callback)) {
      this.handlers.push(callback);
    }
  }

  removeHandler(callback) {
    const toDelete = this.handlers.findIndex(h => h == callback);
    if (index != -1) {
      this.handlers.splice(index,1);
    }
  }

  fire(args) {
    this.handlers.forEach((cb) => {
      if (Array.isArray(args)) {
        cb(...args);
      } else {
        cb(args);
      }
    });
  }
}

class EventAggregator {
  constructor() {
    this.events = {};
  }

  register(name, callback) {
    name = name.toLowerCase();
    if (Object.keys(this.events).includes(name)) {
      console.log(callback);
      console.log(this.events[name]);
      this.events[name].addHandler(callback);
    } else {
      this.events[name] = new Event(name, callback);
    }
  }

  publish(name, args) {
    name = name.toLowerCase();
    if (Object.keys(this.events).includes(name)) {
      this.events[name].fire(args);
    } else {
      this.events[name] = new Event(name);
    }
  }
}


module.exports = { EventAggregator }