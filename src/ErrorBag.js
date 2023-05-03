export default class ErrorBag {
  #data = {};

  add(key, message) {
    if (this.#data.hasOwnProperty(key)) {
      this.#data[key].push(message);
    } else {
      this.#data[key] = [message];
    }
  }

  get(key) {
    if (!key.includes('*')) {
      return this.#data.hasOwnProperty(key) ? this.#data[key] : {};
    }

    const pattern = new RegExp('^' + key.replaceAll('*', '.*?') + '$');
    const result = {};

    for (const [key, value] of Object.entries(this.#data)) {
      if (pattern.test(key)) {
        result[key] = value;
      }
    }

    return result;
  }

  first(key) {
    for (const message of Object.values(this.get(key))) {
      return Array.isArray(message) ? message[0] : message;
    }

    return '';
  }

  has(key) {
    return this.first(key) !== '';
  }

  messages() {
    return this.#data;
  }

  all() {
    const result = [];

    Object.values(this.#data).forEach((messages) => result.push(...messages));

    return result;
  }

  count() {
    let count = 0;

    Object.values(this.#data).forEach((messages) => (count += messages.length));

    return count;
  }

  isEmpty() {
    return Object.keys(this.#data).length === 0;
  }

  isNotEmpty() {
    return !this.isEmpty();
  }
}
