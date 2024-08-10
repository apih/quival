import Checkers from './Checkers.js';
import ErrorBag from './ErrorBag.js';
import Lang from './Lang.js';
import Replacers from './Replacers.js';
import { flattenObject, getByPath, isEmpty, isNumeric, isPlainObject, parseCsvString, toCamelCase, toSnakeCase } from './helpers.js';

export default class Validator {
  static #customCheckers = {};
  static #customReplacers = {};

  static #dummyRules = [
    'active_url',
    'bail',
    'can',
    'current_password',
    'enum',
    'exclude',
    'exclude_if',
    'exclude_unless',
    'exclude_with',
    'exclude_without',
    'exists',
    'nullable',
    'sometimes',
    'unique',
  ];

  static #implicitRules = [
    'accepted',
    'accepted_if',
    'declined',
    'declined_if',
    'filled',
    'missing',
    'missing_if',
    'missing_unless',
    'missing_with',
    'missing_with_all',
    'present',
    'required',
    'required_if',
    'required_if_accepted',
    'required_if_declined',
    'required_unless',
    'required_with',
    'required_with_all',
    'required_without',
    'required_without_all',
  ];

  #data;
  #rules;
  #customMessages;
  #customAttributes;
  #customValues;

  #checkers;
  #replacers;
  #errors;
  #skippedAttributes = [];

  #implicitAttributes = {};
  #stopOnFirstFailure = false;
  #alwaysBail = false;

  fileRules = ['file', 'image', 'mimetypes', 'mimes'];
  numericRules = ['decimal', 'numeric', 'integer'];
  sizeRules = ['size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte'];

  static setLocale(locale) {
    Lang.locale(locale);
  }

  static setMessages(locale, messages) {
    Lang.setMessages(locale, messages);
  }

  static addChecker(rule, method, message) {
    Validator.#customCheckers[rule] = method;

    if (message) {
      Lang.set(rule, message);
    }
  }

  static addImplicitChecker(rule, method, message) {
    Validator.addChecker(rule, method, message);
    Validator.#implicitRules.push(rule);
  }

  static addReplacer(rule, method) {
    Validator.#customReplacers[rule] = method;
  }

  static addDummyRule(rule) {
    Validator.#dummyRules.push(rule);
  }

  constructor(data = {}, rules = {}, messages = {}, attributes = {}, values = {}) {
    this.setProperties(data, rules, messages, attributes, values);

    this.#checkers = new Checkers(this);
    this.#replacers = new Replacers(this);

    for (const [rule, checker] of Object.entries(Validator.#customCheckers)) {
      this.#checkers[toCamelCase('check_' + rule)] = checker;
    }

    for (const [rule, replacer] of Object.entries(Validator.#customReplacers)) {
      this.#replacers[toCamelCase('replace_' + rule)] = replacer;
    }

    this.#errors = new ErrorBag();
  }

  setProperties(data = {}, rules = {}, messages = {}, attributes = {}, values = {}) {
    this.#data = data;
    this.#rules = this.parseRules(rules);
    this.#customMessages = messages;
    this.#customAttributes = attributes;
    this.#customValues = flattenObject(values);

    return this;
  }

  setData(data) {
    this.#data = data;

    return this;
  }

  setRules(rules) {
    this.#rules = this.parseRules(rules);

    return this;
  }

  setCustomMessages(messages) {
    this.#customMessages = messages;

    return this;
  }

  setCustomAttributes(attributes) {
    this.#customAttributes = attributes;

    return this;
  }

  setCustomValues(values) {
    this.#customValues = flattenObject(values);

    return this;
  }

  addImplicitAttribute(implicitAttribute, attribute) {
    this.#implicitAttributes[implicitAttribute] = attribute;

    return this;
  }

  stopOnFirstFailure(flag = true) {
    this.#stopOnFirstFailure = flag;

    return this;
  }

  alwaysBail(flag = true) {
    this.#alwaysBail = flag;

    return this;
  }

  parseRules(rules) {
    const parsedRules = {};

    for (const [attribute, attributeRules] of Object.entries(rules)) {
      const attributes = attribute.includes('*') ? this.parseWildcardAttribute(attribute) : [attribute];

      for (const attribute of attributes) {
        const parsedAttributeRules = [];

        for (const attributeRule of this.parseAttributeRules(attributeRules)) {
          parsedAttributeRules.push(this.parseAttributeRule(attributeRule));
        }

        parsedRules[attribute] = parsedAttributeRules;
      }
    }

    return parsedRules;
  }

  parseWildcardAttribute(attribute) {
    const attributes = [];
    const index = attribute.indexOf('*');
    const parentPath = attribute.substring(0, index - 1);
    const childPath = attribute.substring(index + 2);
    const data = this.getValue(parentPath);

    if (!(Array.isArray(data) || isPlainObject(data))) {
      return [attribute];
    }

    Object.entries(data).forEach(([key, value]) => {
      const implicitAttribute = `${parentPath}.${key}.${childPath}`.replace(/\.$/, '');
      const implicitAttributes = implicitAttribute.includes('*') ? this.parseWildcardAttribute(implicitAttribute) : [implicitAttribute];

      attributes.push(...implicitAttributes);
      implicitAttributes.forEach((value) => (this.#implicitAttributes[value] = attribute));
    });

    return attributes;
  }

  parseAttributeRules(rules) {
    if (Array.isArray(rules)) {
      return rules;
    } else if (typeof rules === 'function') {
      return [rules];
    } else {
      return String(rules).split('|');
    }
  }

  parseAttributeRule(rule) {
    if (Array.isArray(rule)) {
      return [rule[0] ?? '', rule.slice(1)];
    } else if (typeof rule === 'function') {
      return [rule, []];
    }

    const index = rule.indexOf(':');

    if (index === -1) {
      return [rule, []];
    } else {
      return [rule.substring(0, index), parseCsvString(rule.substring(index + 1))];
    }
  }

  async validate() {
    this.#checkers.clearCaches();
    this.#errors = new ErrorBag();

    const tasks = [];
    const skippedAttributes = [];

    for (const [attribute, rules] of Object.entries(this.#rules)) {
      let value = this.getValue(attribute);
      const hasRule = (ruleName) => rules.some((rule) => rule[0] === ruleName);

      if (hasRule('sometimes') && typeof value === 'undefined') {
        skippedAttributes.push(attribute);
        continue;
      }

      tasks.push(async () => {
        const doBail = this.#alwaysBail || hasRule('bail');
        const isNullable = hasRule('nullable');
        let noError = true;

        for (const [rule, parameters] of rules) {
          if (
            rule === '' ||
            (typeof rule !== 'function' &&
              !Validator.#implicitRules.includes(rule) &&
              (typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '') || (isNullable && value === null)))
          ) {
            skippedAttributes.push(attribute);
            continue;
          }

          let result, success, message;

          const checker = (() => {
            if (typeof rule === 'function') {
              return rule;
            } else {
              const checker = this.#checkers[toCamelCase('check_' + rule)] ?? null;

              if (checker === null && Validator.#dummyRules.includes(rule)) {
                return () => true;
              }

              return checker;
            }
          })();

          if (checker === null) {
            throw new Error(`Invalid validation rule: ${rule}`);
          }

          result = await checker.call(this.#checkers, attribute, value, parameters);

          if (typeof result === 'boolean') {
            result = { success: result };
          }

          ({ success, message = '' } = result);

          if (!success) {
            noError = false;
            message = isEmpty(message) ? this.getMessage(attribute, rule) : message;
            message = this.makeReplacements(message, attribute, rule, parameters);

            this.#errors.add(attribute, message);

            if (doBail || Validator.#implicitRules.includes(rule)) {
              break;
            }
          }
        }

        return noError;
      });
    }

    if (this.#stopOnFirstFailure) {
      for (const task of tasks) {
        if (!(await task())) break;
      }
    } else {
      await Promise.allSettled(tasks.map((task) => task()));

      this.#errors.sortByKeys(Object.keys(this.#rules));
    }

    this.#skippedAttributes = skippedAttributes.filter((value, index, array) => array.indexOf(value) === index);

    return this.#errors;
  }

  async passes() {
    await this.validate();

    if (this.#errors.isNotEmpty()) {
      return false;
    }

    return true;
  }

  async fails() {
    return !(await this.passes());
  }

  getMessage(attribute, rule) {
    if (typeof rule === 'function') {
      return '';
    }

    const value = this.getValue(attribute);
    attribute = this.getPrimaryAttribute(attribute);

    let message;

    for (const key of [`${attribute}.${rule}`, rule]) {
      if (Object.hasOwn(this.#customMessages, key)) {
        message = this.#customMessages[key];

        break;
      }
    }

    if (!message) {
      let key = rule;

      if (this.sizeRules.includes(key)) {
        if (Array.isArray(value) || isPlainObject(value) || this.hasRule(attribute, 'array')) {
          key += '.array';
        } else if (value instanceof File || this.hasRule(attribute, this.fileRules)) {
          key += '.file';
        } else if (isNumeric(value) || this.hasRule(attribute, this.numericRules)) {
          key += '.numeric';
        } else {
          key += '.string';
        }
      }

      message = Lang.get(key);
    }

    return message ?? `validation.${rule}`;
  }

  makeReplacements(message, attribute, rule, parameters) {
    const attributeName = this.getDisplayableAttribute(attribute);
    const value = this.getValue(attribute);

    const data = {
      attribute: attributeName,
      ATTRIBUTE: attributeName.toLocaleUpperCase(),
      Attribute: attributeName.charAt(0).toLocaleUpperCase() + attributeName.substring(1),
      input: this.getDisplayableValue(attribute, value),
    };

    for (const [key, value] of Object.entries(data)) {
      message = message.replaceAll(':' + key, value);
    }

    const match = attribute.match(/\.(\d+)\.?/);
    const index = match === null ? -1 : parseInt(match[1], 10);

    if (index !== -1) {
      message = message.replaceAll(':index', index).replaceAll(':position', index + 1);
    }

    if (typeof rule === 'string') {
      const replacer = this.#replacers[toCamelCase('replace_' + rule)] ?? null;

      if (replacer) {
        message = replacer.call(this.#replacers, message, attribute, rule, parameters);
      }
    }

    return message;
  }

  getDisplayableAttribute(attribute) {
    const unparsed = this.getPrimaryAttribute(attribute);

    for (const name of [attribute, unparsed]) {
      if (Object.hasOwn(this.#customAttributes, name)) {
        return this.#customAttributes[name];
      } else if (Lang.has(`attributes.${name}`)) {
        return Lang.get(`attributes.${name}`);
      }
    }

    if (Object.hasOwn(this.#implicitAttributes, attribute)) {
      return attribute;
    }

    return toSnakeCase(attribute).replaceAll('_', ' ');
  }

  getDisplayableValue(attribute, value) {
    attribute = this.getPrimaryAttribute(attribute);

    const path = `${attribute}.${value}`;

    if (isEmpty(value)) {
      return 'empty';
    } else if (typeof value === 'boolean' || this.hasRule(attribute, 'boolean')) {
      return Number(value) ? 'true' : 'false';
    } else if (Object.hasOwn(this.#customValues, path)) {
      return this.#customValues[path];
    } else if (Lang.has(`values.${path}`)) {
      return Lang.get(`values.${path}`);
    }

    return value;
  }

  getSize(attribute, value) {
    if (isEmpty(value)) {
      return 0;
    } else if (isNumeric(value) && this.hasRule(attribute, this.numericRules)) {
      return parseFloat(typeof value === 'string' ? value.trim() : value, 10);
    } else if (value instanceof File) {
      return value.size / 1024;
    } else if (isPlainObject(value)) {
      return Object.keys(value).length;
    } else if (Object.hasOwn(value, 'length')) {
      return value.length;
    }

    return value;
  }

  getRule(attribute) {
    attribute = this.getPrimaryAttribute(attribute);

    return this.#rules[attribute] ?? {};
  }

  hasRule(attribute, rules) {
    attribute = this.getPrimaryAttribute(attribute);
    rules = typeof rules === 'string' ? [rules] : rules;

    if (!Object.hasOwn(this.#rules, attribute)) {
      return false;
    }

    for (const rule of rules) {
      if (this.#rules[attribute].some((attributeRule) => attributeRule[0] === rule)) {
        return true;
      }
    }

    return false;
  }

  getPrimaryAttribute(attribute) {
    return Object.hasOwn(this.#implicitAttributes, attribute) ? this.#implicitAttributes[attribute] : attribute;
  }

  hasAttribute(attribute) {
    return typeof this.getValue(attribute) !== 'undefined';
  }

  getValue(attribute) {
    return getByPath(this.#data, attribute);
  }

  errors() {
    return this.#errors;
  }

  skippedAttributes() {
    return this.#skippedAttributes;
  }
}
