import { flattenObject, isPlainObject } from './helpers.js';

export default class Lang {
  static #locale;
  static #messages = {};

  static locale(locale) {
    this.#locale = locale;
  }

  static setMessages(locale, messages) {
    this.#messages[locale] = flattenObject(messages);
  }

  static get(path) {
    return this.#messages[this.#locale][path];
  }

  static has(path) {
    return typeof this.get(path) === 'undefined' ? false : true;
  }

  static set(path, value) {
    if (isPlainObject(value)) {
      Object.assign(this.#messages[this.#locale], flattenObject(value, path));
    } else if (typeof value === 'string') {
      this.#messages[this.#locale][path] = value;
    }
  }
}
