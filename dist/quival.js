/*!
 * quival v0.3.1 (https://github.com/apih/quival)
 * (c) 2023 Mohd Hafizuddin M Marzuki <hafizuddin_83@yahoo.com>
 * Released under the MIT License.
 */
var quival = (function (exports) {
  'use strict';

  function toCamelCase(string) {
    return string
      .replace(/[-_]/g, ' ')
      .replace(/\s+/, ' ')
      .trim()
      .replace(/(\s\w)/g, (match) => match[1].toUpperCase());
  }
  function toSnakeCase(string) {
    return string.replace(/(.)(?=[A-Z])/g, (match) => match + '_').toLowerCase();
  }
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function getByPath(obj, path, defaultValue) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (!Object.hasOwn(current, key)) {
        return defaultValue;
      }
      current = current[key];
    }
    return current;
  }
  function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((accumulator, key) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(accumulator, flattenObject(obj[key], prefixedKey));
      } else {
        accumulator[prefixedKey] = obj[key];
      }
      return accumulator;
    }, {});
  }
  function parseCsvString(value) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (char === '"') {
        if (insideQuotes && value[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
          if (insideQuotes) {
            current = current.trim();
          }
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
  function parseDate(value) {
    if (isEmpty(value) || typeof value !== 'string') {
      return new Date('');
    } else if (value instanceof Date) {
      return value;
    }
    let match, years, months, days, hours, minutes, seconds, meridiem;
    const castToIntegers = (value) => (value && /^\d*$/.test(value) ? parseInt(value) : value);
    if ((match = value.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})\s?((\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?)?/i)) !== null) {
      [, days, months, years, , hours = 0, minutes = 0, , seconds = 0, meridiem = 'am'] = match.map(castToIntegers);
    } else if (
      (match = value.match(/^(\d{2,4})[.\/-](\d{1,2})[.\/-](\d{1,2})\s?((\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?)?/i)) !== null ||
      (match = value.match(/^(\d{4})(\d{2})(\d{2})\s?((\d{2})(\d{2})((\d{2}))?\s?(am|pm)?)?/i)) !== null
    ) {
      [, years, months, days, , hours = 0, minutes = 0, , seconds = 0, meridiem = 'am'] = match.map(castToIntegers);
    } else if ((match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?\s?(\d{4})[.\/-](\d{2})[.\/-](\d{2})/i))) {
      [, hours, minutes, , seconds, meridiem = 'am', years, months, days] = match.map(castToIntegers);
    } else if ((match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?\s?(\d{2})[.\/-](\d{2})[.\/-](\d{4})/i))) {
      [, hours, minutes, , seconds, meridiem = 'am', days, months, years] = match.map(castToIntegers);
    } else if ((match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?/i))) {
      const current = new Date();
      years = current.getFullYear();
      months = current.getMonth() + 1;
      days = current.getDate();
      [, hours = 0, minutes = 0, , seconds = 0, meridiem = 'am'] = match.map(castToIntegers);
    } else {
      return new Date(value);
    }
    if (years >= 10 && years < 100) {
      years += 2000;
    }
    if (meridiem.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    return new Date(`${years}-${months}-${days} ${hours}:${minutes}:${seconds}`);
  }
  function parseDateByFormat(value, format) {
    if (isEmpty(value)) {
      return new Date('');
    }
    format = format.split('');
    const formats = {
      Y: '(\\d{4})',
      y: '(\\d{2})',
      m: '(\\d{2})',
      n: '([1-9]\\d?)',
      d: '(\\d{2})',
      j: '([1-9]\\d?)',
      G: '([1-9]\\d?)',
      g: '([1-9]\\d?)',
      H: '(\\d{2})',
      h: '(\\d{2})',
      i: '(\\d{2})',
      s: '(\\d{2})',
      A: '(AM|PM)',
      a: '(am|pm)',
    };
    let pattern = '^';
    let indices = {
      years: -1,
      months: -1,
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1,
      meridiem: -1,
    };
    let index = 1;
    for (const char of format) {
      if (Object.hasOwn(formats, char)) {
        pattern += formats[char];
        if (['Y', 'y'].indexOf(char) !== -1) {
          indices.years = index++;
        } else if (['m', 'n'].indexOf(char) !== -1) {
          indices.months = index++;
        } else if (['d', 'j'].indexOf(char) !== -1) {
          indices.days = index++;
        } else if (['G', 'g', 'H', 'h'].indexOf(char) !== -1) {
          indices.hours = index++;
        } else if (char === 'i') {
          indices.minutes = index++;
        } else if (char === 's') {
          indices.seconds = index++;
        } else if (['A', 'a'].indexOf(char) !== -1) {
          indices.meridiem = index++;
        }
      } else {
        pattern += '\\' + char;
      }
    }
    pattern += '$';
    let match = value.match(new RegExp(pattern));
    if (match === null) {
      return new Date('');
    }
    match = match.map((value) => (value && /^\d*$/.test(value) ? parseInt(value) : value));
    const current = new Date();
    let years = match[indices.years];
    let months = match[indices.months];
    let days = match[indices.days];
    let hours = match[indices.hours] ?? 0;
    let minutes = match[indices.minutes] ?? 0;
    let seconds = match[indices.seconds] ?? 0;
    let meridiem = match[indices.meridiem] ?? 'am';
    if (!years && !months && !days) {
      years = current.getFullYear();
      months = current.getMonth() + 1;
      days = current.getDate();
    } else if (years && !months && !days) {
      months = 1;
      days = 1;
    } else if (!years && months && !days) {
      years = current.getFullYear();
      days = 1;
    } else if (!years && !months && days) {
      years = current.getFullYear();
      months = current.getMonth() + 1;
    }
    if (years >= 10 && years < 100) {
      years = years + 2000;
    }
    if (meridiem.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    return new Date(`${years}-${months}-${days} ${hours}:${minutes}:${seconds}`);
  }
  function isDigits(value) {
    return String(value).search(/[^0-9]/) === -1;
  }
  function isEmpty(value) {
    return value === '' || value === null || typeof value === 'undefined';
  }
  function isNumeric(value) {
    const number = Number(value);
    return value !== null && typeof value !== 'boolean' && typeof number === 'number' && !isNaN(number);
  }
  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }
  function isValidDate(value) {
    return value instanceof Date && value.toDateString() !== 'Invalid Date';
  }

  class Checkers {
    #distinctCache;
    #imageCache;
    constructor(validator) {
      this.#distinctCache = {};
      this.#imageCache = {};
      this.validator = validator;
    }
    // Internal helpers
    clearCaches() {
      this.#distinctCache = {};
      this.#imageCache = {};
    }
    isDependent(parameters) {
      const other = this.validator.getValue(parameters[0]);
      return parameters.slice(1).some((value) => value == other);
    }
    collectRequiredsThenTest(attribute, value, parameters, callback) {
      let result = [];
      for (const other of parameters) {
        result.push(this.checkRequired(other, this.validator.getValue(other)));
      }
      if (callback(result)) {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    collectMissingsThenTest(attribute, value, parameters, callback) {
      let result = [];
      for (const other of parameters) {
        result.push(this.checkMissing(other));
      }
      if (callback(result)) {
        return this.checkMissing(attribute);
      }
      return true;
    }
    testStringUsingRegex(attribute, value, asciiRegex, unicodeRegex, isAscii = false) {
      if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
      }
      value = String(value);
      if (isAscii || this.validator.hasRule(attribute, 'ascii')) {
        return asciiRegex.test(value);
      }
      return unicodeRegex.test(value);
    }
    compareValues(attribute, value, parameters, callback) {
      if (isEmpty(value)) {
        return false;
      }
      const other = parameters[0] ?? '';
      let otherValue = this.validator.getValue(other);
      if (typeof otherValue === 'undefined') {
        if (isNumeric(other)) {
          otherValue = parseFloat(other, 10);
        } else {
          otherValue = null;
        }
      } else {
        otherValue = this.validator.getSize(other, otherValue);
      }
      if (isEmpty(otherValue)) {
        return false;
      }
      return callback(this.validator.getSize(attribute, value), otherValue);
    }
    compareDates(attribute, value, parameters, callback) {
      const rule = this.validator.getRule(attribute);
      value = Object.hasOwn(rule, 'date_format') ? parseDateByFormat(value, rule.date_format[0]) : parseDate(value);
      if (!isValidDate(value)) {
        return false;
      }
      const other = parameters[0] ?? '';
      let otherValue = this.validator.getValue(other);
      if (typeof otherValue === 'undefined') {
        otherValue = parseDate(other);
      } else {
        const otherRule = this.validator.getRule(other);
        otherValue = Object.hasOwn(otherRule, 'date_format') ? parseDateByFormat(otherValue, otherRule.date_format[0]) : parseDate(otherValue);
      }
      if (!isValidDate(otherValue)) {
        return false;
      }
      return callback(value.getTime(), otherValue.getTime());
    }
    // Type
    checkArray(attribute, value, parameters) {
      if (!(Array.isArray(value) || isPlainObject(value))) {
        return false;
      }
      if (parameters && parameters.length > 0) {
        for (const key of Object.keys(value)) {
          if (!parameters.includes(key)) {
            return false;
          }
        }
      }
      return true;
    }
    checkList(attribute, value, parameters) {
      return Array.isArray(value);
    }
    checkBoolean(attribute, value, parameters) {
      return [true, false, 0, 1, '0', '1'].includes(value);
    }
    checkDate(attribute, value, parameters) {
      return isValidDate(parseDate(value));
    }
    checkFile(attribute, value, parameters) {
      return value instanceof File;
    }
    checkInteger(attribute, value, parameters) {
      return String(parseInt(value, 10)) === String(value);
    }
    checkNumeric(attribute, value, parameters) {
      return isNumeric(value);
    }
    checkString(attribute, value, parameters) {
      return typeof value === 'string';
    }
    // Numeric
    checkDecimal(attribute, value, parameters) {
      if (!this.checkNumeric(attribute, value)) {
        return false;
      }
      const decimals = (String(value).split('.')[1] ?? '').length;
      if (parameters.length === 1) {
        return decimals == parameters[0];
      }
      return decimals >= parameters[0] && decimals <= parameters[1];
    }
    checkMultipleOf(attribute, value, parameters) {
      if (!isNumeric(value) || !isNumeric(parameters[0])) {
        return false;
      }
      const numerator = parseInt(value, 10);
      const denominator = parseInt(parameters[0], 10);
      if (numerator === 0 && denominator === 0) {
        return false;
      } else if (numerator === 0) {
        return true;
      } else if (denominator === 0) {
        return false;
      }
      return numerator % denominator === 0;
    }
    // Agreement
    checkAccepted(attribute, value, parameters) {
      return ['yes', 'on', '1', 1, true, 'true'].includes(value);
    }
    checkAcceptedIf(attribute, value, parameters) {
      if (this.isDependent(parameters)) {
        return this.checkAccepted(attribute, value, parameters);
      }
      return true;
    }
    checkDeclined(attribute, value, parameters) {
      return ['no', 'off', '0', 0, false, 'false'].includes(value);
    }
    checkDeclinedIf(attribute, value, parameters) {
      if (this.isDependent(parameters)) {
        return this.checkDeclined(attribute, value, parameters);
      }
      return true;
    }
    // Existence
    checkRequired(attribute, value, parameters) {
      if (isEmpty(value)) {
        return false;
      } else if (Array.isArray(value)) {
        return value.length > 0;
      } else if (value instanceof File) {
        return value.size > 0;
      }
      value = String(value).replace(/\s/g, '');
      return value.length > 0;
    }
    checkRequiredArrayKeys(attribute, value, parameters) {
      if (!this.checkArray(attribute, value)) {
        return false;
      }
      const keys = Object.keys(value);
      for (const parameter of parameters) {
        if (!keys.includes(parameter)) {
          return false;
        }
      }
      return true;
    }
    checkRequiredIf(attribute, value, parameters) {
      if (this.isDependent(parameters)) {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    checkRequiredIfAccepted(attribute, value, parameters) {
      if (this.checkAccepted(parameters[0], this.validator.getValue(parameters[0]))) {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    checkRequiredIfDeclined(attribute, value, parameters) {
      if (this.checkDeclined(parameters[0], this.validator.getValue(parameters[0]))) {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    checkRequiredUnless(attribute, value, parameters) {
      if (!this.isDependent(parameters)) {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    checkRequiredWith(attribute, value, parameters) {
      return this.collectRequiredsThenTest(attribute, value, parameters, (result) => result.includes(true));
    }
    checkRequiredWithAll(attribute, value, parameters) {
      return this.collectRequiredsThenTest(attribute, value, parameters, (result) => !result.includes(false));
    }
    checkRequiredWithout(attribute, value, parameters) {
      return this.collectRequiredsThenTest(attribute, value, parameters, (result) => result.includes(false));
    }
    checkRequiredWithoutAll(attribute, value, parameters) {
      return this.collectRequiredsThenTest(attribute, value, parameters, (result) => !result.includes(true));
    }
    checkFilled(attribute, value, parameters) {
      if (typeof value !== 'undefined') {
        return this.checkRequired(attribute, value);
      }
      return true;
    }
    checkPresent(attribute, value, parameters) {
      return typeof value !== 'undefined';
    }
    // Missing
    checkMissing(attribute, value, parameters) {
      return !this.validator.hasAttribute(attribute);
    }
    checkMissingIf(attribute, value, parameters) {
      if (this.isDependent(parameters)) {
        return this.checkMissing(attribute);
      }
      return true;
    }
    checkMissingUnless(attribute, value, parameters) {
      if (!this.isDependent(parameters)) {
        return this.checkMissing(attribute);
      }
      return true;
    }
    checkMissingWith(attribute, value, parameters) {
      return this.collectMissingsThenTest(attribute, value, parameters, (result) => result.includes(false));
    }
    checkMissingWithAll(attribute, value, parameters) {
      return this.collectMissingsThenTest(attribute, value, parameters, (result) => !result.includes(true));
    }
    // Prohibition
    checkProhibited(attribute, value, parameters) {
      return !this.checkRequired(attribute, value);
    }
    checkProhibitedIf(attribute, value, parameters) {
      if (this.isDependent(parameters)) {
        return !this.checkRequired(attribute, value);
      }
      return true;
    }
    checkProhibitedUnless(attribute, value, parameters) {
      if (!this.isDependent(parameters)) {
        return !this.checkRequired(attribute, value);
      }
      return true;
    }
    checkProhibits(attribute, value, parameters) {
      if (this.checkRequired(attribute, value)) {
        for (const parameter of parameters) {
          if (this.checkRequired(parameter, this.validator.getValue(parameter))) {
            return false;
          }
        }
      }
      return true;
    }
    // Size
    checkSize(attribute, value, parameters) {
      return this.validator.getSize(attribute, value) === parseFloat(parameters[0]);
    }
    checkMin(attribute, value, parameters) {
      return this.validator.getSize(attribute, value) >= parseFloat(parameters[0]);
    }
    checkMax(attribute, value, parameters) {
      return this.validator.getSize(attribute, value) <= parseFloat(parameters[0]);
    }
    checkBetween(attribute, value, parameters) {
      return this.checkMin(attribute, value, [parameters[0]]) && this.checkMax(attribute, value, [parameters[1]]);
    }
    // Digits
    checkDigits(attribute, value, parameters, callback = (length, value) => length === value) {
      value = String(value ?? '');
      if (!isDigits(value)) {
        return false;
      }
      return callback(value.length, parseInt(parameters[0], 10), parseInt(parameters[1] ?? 0, 10));
    }
    checkMinDigits(attribute, value, parameters) {
      return this.checkDigits(attribute, value, parameters, (length, value) => length >= value);
    }
    checkMaxDigits(attribute, value, parameters) {
      return this.checkDigits(attribute, value, parameters, (length, value) => length <= value);
    }
    checkDigitsBetween(attribute, value, parameters) {
      return this.checkDigits(attribute, value, parameters, (length, value1, value2) => length >= value1 && length <= value2);
    }
    // String
    checkAlpha(attribute, value, parameters) {
      return this.testStringUsingRegex(attribute, value, /^[a-z]+$/i, /^[\p{L}\p{M}]+$/u, parameters.includes('ascii'));
    }
    checkAlphaDash(attribute, value, parameters) {
      return this.testStringUsingRegex(attribute, value, /^[a-z0-9_-]+$/i, /^[\p{L}\p{M}\p{N}_-]+$/u, parameters.includes('ascii'));
    }
    checkAlphaNum(attribute, value, parameters) {
      return this.testStringUsingRegex(attribute, value, /^[a-z0-9]+$/i, /^[\p{L}\p{M}\p{N}]+$/u, parameters.includes('ascii'));
    }
    checkAscii(attribute, value, parameters) {
      return !/[^\x09\x10\x13\x0A\x0D\x20-\x7E]/.test(value);
    }
    checkRegex(attribute, value, parameters, invert = false) {
      if (!(typeof value === 'string' || isNumeric(value))) {
        return false;
      }
      const expression = parameters.join(',');
      let [whole, pattern, flags] = expression.match(/^\/(.*)\/([gimu]*)$/) ?? [];
      if (isEmpty(whole)) {
        throw new Error(`Invalid regular expression pattern: ${expression}`);
      }
      if (flags.includes('u')) {
        pattern = pattern
          .replace(/\\A/g, '^')
          .replace(/\\z/gi, '$')
          .replace(/\\([pP])([CLMNPSZ])/g, '\\$1{$2}')
          .replace(/\\\x\{([0-9a-f]+)\}/g, '\\u{$1}');
      }
      const result = new RegExp(pattern, flags).test(value);
      return invert ? !result : result;
    }
    checkNotRegex(attribute, value, parameters) {
      return this.checkRegex(attribute, value, parameters, true);
    }
    checkLowercase(attribute, value, parameters) {
      return value === String(value).toLocaleLowerCase();
    }
    checkUppercase(attribute, value, parameters) {
      return value === String(value).toLocaleUpperCase();
    }
    checkStartsWith(attribute, value, parameters) {
      value = String(value);
      for (const parameter of parameters) {
        if (value.startsWith(parameter)) {
          return true;
        }
      }
      return false;
    }
    checkDoesntStartWith(attribute, value, parameters) {
      return !this.checkStartsWith(attribute, value, parameters);
    }
    checkEndsWith(attribute, value, parameters) {
      value = String(value);
      for (const parameter of parameters) {
        if (value.endsWith(parameter)) {
          return true;
        }
      }
      return false;
    }
    checkDoesntEndWith(attribute, value, parameters) {
      return !this.checkEndsWith(attribute, value, parameters);
    }
    // Compare values
    checkSame(attribute, value, parameters) {
      const other = this.validator.getValue(parameters[0]);
      return value === other;
    }
    checkDifferent(attribute, value, parameters) {
      for (const parameter of parameters) {
        const other = this.validator.getValue(parameter);
        if (typeof other !== 'undefined' && value === other) {
          return false;
        }
      }
      return true;
    }
    checkConfirmed(attribute, value, parameters) {
      return this.checkSame(attribute, value, [attribute + '_confirmation']);
    }
    checkGt(attribute, value, parameters) {
      return this.compareValues(attribute, value, parameters, (val1, val2) => val1 > val2);
    }
    checkGte(attribute, value, parameters) {
      return this.compareValues(attribute, value, parameters, (val1, val2) => val1 >= val2);
    }
    checkLt(attribute, value, parameters) {
      return this.compareValues(attribute, value, parameters, (val1, val2) => val1 < val2);
    }
    checkLte(attribute, value, parameters) {
      return this.compareValues(attribute, value, parameters, (val1, val2) => val1 <= val2);
    }
    // Dates
    checkAfter(attribute, value, parameters) {
      return this.compareDates(attribute, value, parameters, (val1, val2) => val1 > val2);
    }
    checkAfterOrEqual(attribute, value, parameters) {
      return this.compareDates(attribute, value, parameters, (val1, val2) => val1 >= val2);
    }
    checkBefore(attribute, value, parameters) {
      return this.compareDates(attribute, value, parameters, (val1, val2) => val1 < val2);
    }
    checkBeforeOrEqual(attribute, value, parameters) {
      return this.compareDates(attribute, value, parameters, (val1, val2) => val1 <= val2);
    }
    checkDateEquals(attribute, value, parameters) {
      return this.compareDates(attribute, value, parameters, (val1, val2) => val1 === val2);
    }
    checkDateFormat(attribute, value, parameters) {
      const format = parameters[0].split('');
      const formats = {
        Y: '(\\d{4})',
        y: '(\\d{2})',
        m: '(\\d{2})',
        n: '([1-9]\\d?)',
        d: '(\\d{2})',
        j: '([1-9]\\d?)',
        G: '([1-9]\\d?)',
        g: '([1-9]\\d?)',
        H: '(\\d{2})',
        h: '(\\d{2})',
        i: '(\\d{2})',
        s: '(\\d{2})',
        A: '(AM|PM)',
        a: '(am|pm)',
      };
      let pattern = '^';
      for (const char of format) {
        if (Object.hasOwn(formats, char)) {
          pattern += formats[char];
        } else {
          pattern += '\\' + char;
        }
      }
      pattern += '$';
      return new RegExp(pattern).test(value);
    }
    // Array / Object
    checkDistinct(attribute, value, parameters) {
      const unparsed = this.validator.getPrimaryAttribute(attribute);
      if (!unparsed.includes('*')) {
        return true;
      }
      const index = unparsed.indexOf('*');
      const parentPath = unparsed.substring(0, index - 1);
      let stringified;
      if (Object.hasOwn(this.#distinctCache, parentPath)) {
        stringified = this.#distinctCache[parentPath];
      } else {
        stringified = JSON.stringify(flattenObject(this.validator.getValue(parentPath) ?? {}));
        this.#distinctCache[parentPath] = stringified;
      }
      const ignoreCase = parameters.includes('ignore_case');
      const isStrict = !ignoreCase && parameters.includes('strict');
      const escapedValue = escapeRegExp(String(value));
      let pattern = `"${escapeRegExp(unparsed.substring(index)).replaceAll('\\*', '[^."]+')}":`;
      let counter = 0;
      if (isStrict) {
        if (typeof value === 'string') {
          pattern += `"${escapedValue}"`;
        } else {
          pattern += `${escapedValue}`;
        }
      } else {
        pattern += `(${escapedValue}|"${escapedValue}")`;
      }
      pattern += '[,}]+';
      counter += stringified.match(new RegExp(pattern, 'g' + (ignoreCase ? 'i' : '')))?.length ?? 0;
      return counter === 1;
    }
    checkInArray(attribute, value, parameters) {
      const unparsed = this.validator.getPrimaryAttribute(parameters[0]);
      if (!unparsed.includes('*')) {
        return false;
      }
      const data = this.validator.getValue(unparsed.split('.*')[0]) ?? {};
      return Object.values(flattenObject(data)).some((item) => item == value);
    }
    checkIn(attribute, value, parameters) {
      if (!(this.checkArray(attribute, value) && this.validator.hasRule(attribute, 'array'))) {
        return parameters.some((parameter) => parameter == value);
      }
      for (const item of Object.values(value)) {
        if (!parameters.some((parameter) => parameter == item)) {
          return false;
        }
      }
      return true;
    }
    checkNotIn(attribute, value, parameters) {
      return !this.checkIn(attribute, value, parameters);
    }
    // File
    checkMimetypes(attribute, value, parameters) {
      if (this.checkFile(attribute, value)) {
        return parameters.includes(value.type);
      }
      return false;
    }
    checkMimes(attribute, value, parameters) {
      if (this.checkFile(attribute, value)) {
        return parameters.includes(value.name.split('.').pop().toLowerCase());
      }
      return false;
    }
    checkExtensions(attribute, value, parameters) {
      return this.checkMimes(attribute, value, parameters);
    }
    async checkImage(attribute, value, parameters) {
      let result = this.checkMimes(attribute, value, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']);
      if (!result || typeof FileReader === 'undefined') {
        return result;
      }
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(value);
      })
        .then(async (data) => {
          const image = new Image();
          image.src = data;
          await image.decode();
          this.#imageCache[attribute] = image;
        })
        .catch(() => {
          result = false;
        });
      return result;
    }
    async checkDimensions(attribute, value, parameters) {
      if (!this.checkImage(attribute, value) || !Object.hasOwn(this.#imageCache, attribute)) {
        return false;
      }
      const constraints = {};
      for (const parameter of parameters) {
        const [key, value] = parameter.split('=', 2);
        if (key === 'ratio' && value.includes('/')) {
          const [numerator, denominator] = value.split('/', 2).map((part) => parseFloat(part, 10));
          constraints[key] = numerator / denominator;
        } else {
          constraints[key] = parseFloat(value, 10);
        }
      }
      const image = this.#imageCache[attribute];
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      if (
        (Object.hasOwn(constraints, 'width') && constraints.width !== width) ||
        (Object.hasOwn(constraints, 'height') && constraints.height !== height) ||
        (Object.hasOwn(constraints, 'min_width') && constraints.min_width > width) ||
        (Object.hasOwn(constraints, 'min_height') && constraints.min_height > height) ||
        (Object.hasOwn(constraints, 'max_width') && constraints.max_width < width) ||
        (Object.hasOwn(constraints, 'max_height') && constraints.max_height < height)
      ) {
        return false;
      }
      if (Object.hasOwn(constraints, 'ratio')) {
        return Math.abs(constraints.ratio - width / height) <= 1 / (Math.max(width, height) + 1);
      }
      return true;
    }
    // Miscellaneous
    checkEmail(attribute, value, parameters) {
      const firstRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!firstRegex.test(value)) {
        const secondRegex =
          /^((?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]|[^\u0000-\u007F])+@(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?(?:\.(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?)+)*$/;
        return secondRegex.test(value);
      }
      return true;
    }
    checkJson(attribute, value, parameters) {
      try {
        JSON.parse(value);
      } catch (error) {
        return false;
      }
      return true;
    }
    checkHexColor(attribute, value, parameters) {
      return /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i.test(value);
    }
    checkMacAddress(attribute, value, parameters) {
      value = String(value);
      const separators = {
        '-': 2,
        ':': 2,
        '.': 4,
      };
      let separator, digits;
      for ([separator, digits] of Object.entries(separators)) {
        if (value.includes(separator)) {
          break;
        }
      }
      const blocks = value.split(separator);
      if (blocks.length !== 12 / digits) {
        return false;
      }
      for (const block of blocks) {
        if (!new RegExp('^[0-9a-f]{' + digits + '}$', 'i').test(block)) {
          return false;
        }
      }
      return true;
    }
    checkIpv4(attribute, value, parameters) {
      if (/[^\d.]/.test(value)) {
        return false;
      }
      const blocks = String(value).split('.');
      if (blocks.length !== 4) {
        return false;
      }
      for (const block of blocks) {
        if (block < 0 || block > 255) {
          return false;
        }
      }
      return true;
    }
    checkIpv6(attribute, value, parameters) {
      value = String(value);
      if (value.includes(':::') || value.split('::').length > 2) {
        return false;
      }
      const blocks = value.split(':');
      if (blocks.length < 3 || blocks.length > 8) {
        return false;
      }
      for (const block of blocks) {
        if (block !== '' && !/^[0-9a-f]{1,4}$/i.test(block)) {
          return false;
        }
      }
      return true;
    }
    checkIp(attribute, value, parameters) {
      return this.checkIpv4(attribute, value, parameters) || this.checkIpv6(attribute, value, parameters);
    }
    checkTimezone(attribute, value, parameters) {
      try {
        Intl.DateTimeFormat(undefined, {
          timeZone: value,
        });
      } catch (error) {
        if (String(error).toLowerCase().includes('invalid time zone')) {
          return false;
        }
      }
      return true;
    }
    checkUrl(attribute, value, parameters) {
      try {
        new URL(value);
      } catch (error) {
        return false;
      }
      return true;
    }
    checkUlid(attribute, value, parameters) {
      return /[0-7][0-9A-HJKMNP-TV-Z]{25}/.test(value);
    }
    checkUuid(attribute, value, parameters) {
      return /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(value);
    }
  }

  class ErrorBag {
    #data;
    keys() {
      return Object.keys(this.#data);
    }
    values() {
      return Object.values(this.#data);
    }
    entries() {
      return Object.entries(this.#data);
    }
    add(key, message) {
      if (Object.hasOwn(this.#data, key)) {
        this.#data[key].push(message);
      } else {
        this.#data[key] = [message];
      }
    }
    get(key) {
      if (!key.includes('*')) {
        return Object.hasOwn(this.#data, key) ? this.#data[key] : {};
      }
      const pattern = new RegExp('^' + key.replaceAll('*', '.*?') + '$');
      const result = {};
      for (const [key, value] of this.entries()) {
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
      this.values().forEach((messages) => result.push(...messages));
      return result;
    }
    count() {
      let count = 0;
      this.values().forEach((messages) => (count += messages.length));
      return count;
    }
    isEmpty() {
      return this.keys().length === 0;
    }
    isNotEmpty() {
      return !this.isEmpty();
    }
    sortByKeys(keys) {
      const data = {};
      for (const key of keys) {
        if (Object.hasOwn(this.#data, key)) {
          data[key] = this.#data[key];
        }
      }
      this.#data = data;
    }
    constructor() {
      this.#data = {};
    }
  }

  class Lang {
    static #locale;
    static #messages = {};
    static locale(locale) {
      this.#locale = locale;
    }
    static setMessages(locale, messages) {
      this.#messages[locale] = flattenObject(messages);
    }
    static get(path) {
      if (this.#messages[this.#locale] && this.#messages[this.#locale][path]) {
        return this.#messages[this.#locale][path];
      }
      return;
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

  class Replacers {
    constructor(validator) {
      this.validator = validator;
    }
    replace(message, data) {
      Object.entries(data).forEach(([key, value]) => (message = message.replaceAll(':' + key, value)));
      return message;
    }
    // Numeric
    replaceDecimal(message, attribute, rule, parameters) {
      return this.replace(message, {
        decimal: parameters.join('-'),
      });
    }
    replaceMultipleOf(message, attribute, rule, parameters) {
      return this.replace(message, {
        value: parameters[0],
      });
    }
    // Agreement
    replaceAcceptedIf(message, attribute, rule, parameters) {
      return this.replace(message, {
        other: this.validator.getDisplayableAttribute(parameters[0]),
        value: this.validator.getDisplayableValue(parameters[0], this.validator.getValue(parameters[0])),
      });
    }
    replaceDeclinedIf(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    // Existence
    replaceRequiredArrayKeys(message, attribute, rule, parameters) {
      return this.replace(message, {
        values: parameters.map((value) => this.validator.getDisplayableValue(attribute, value)).join(', '),
      });
    }
    replaceRequiredIf(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceRequiredIfAccepted(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceRequiredIfDeclined(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceRequiredUnless(message, attribute, rule, parameters) {
      return this.replace(message, {
        other: this.validator.getDisplayableAttribute(parameters[0]),
        values: parameters
          .slice(1)
          .map((value) => this.validator.getDisplayableValue(parameters[0], value))
          .join(', '),
      });
    }
    replaceRequiredWith(message, attribute, rule, parameters) {
      return this.replace(message, {
        values: parameters.map((value) => this.validator.getDisplayableAttribute(value)).join(' / '),
      });
    }
    replaceRequiredWithAll(message, attribute, rule, parameters) {
      return this.replaceRequiredWith(message, attribute, rule, parameters);
    }
    replaceRequiredWithout(message, attribute, rule, parameters) {
      return this.replaceRequiredWith(message, attribute, rule, parameters);
    }
    replaceRequiredWithoutAll(message, attribute, rule, parameters) {
      return this.replaceRequiredWith(message, attribute, rule, parameters);
    }
    // Missing
    replaceMissingIf(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceMissingUnless(message, attribute, rule, parameters) {
      return this.replace(this.replaceRequiredUnless(message, attribute, rule, parameters), {
        value: this.validator.getDisplayableValue(parameters[0], parameters[1]),
      });
    }
    replaceMissingWith(message, attribute, rule, parameters) {
      return this.replaceRequiredWith(message, attribute, rule, parameters);
    }
    replaceMissingWithAll(message, attribute, rule, parameters) {
      return this.replaceRequiredWith(message, attribute, rule, parameters);
    }
    // Prohibition
    replaceProhibitedIf(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceProhibitedUnless(message, attribute, rule, parameters) {
      return this.replaceRequiredUnless(message, attribute, rule, parameters);
    }
    replaceProhibits(message, attribute, rule, parameters) {
      return this.replace(message, {
        other: parameters.map((value) => this.validator.getDisplayableAttribute(value)).join(' / '),
      });
    }
    // Size
    replaceSize(message, attribute, rule, parameters) {
      return this.replace(message, {
        size: parameters[0],
      });
    }
    replaceMin(message, attribute, rule, parameters) {
      return this.replace(message, {
        min: parameters[0],
      });
    }
    replaceMax(message, attribute, rule, parameters) {
      return this.replace(message, {
        max: parameters[0],
      });
    }
    replaceBetween(message, attribute, rule, parameters) {
      return this.replace(message, {
        min: parameters[0],
        max: parameters[1],
      });
    }
    // Digits
    replaceDigits(message, attribute, rule, parameters) {
      return this.replace(message, {
        digits: parameters[0],
      });
    }
    replaceMinDigits(message, attribute, rule, parameters) {
      return this.replaceMin(message, attribute, rule, parameters);
    }
    replaceMaxDigits(message, attribute, rule, parameters) {
      return this.replaceMax(message, attribute, rule, parameters);
    }
    replaceDigitsBetween(message, attribute, rule, parameters) {
      return this.replaceBetween(message, attribute, rule, parameters);
    }
    // String
    replaceStartsWith(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    replaceDoesntStartWith(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    replaceEndsWith(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    replaceDoesntEndWith(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    // Compare values
    replaceSame(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceDifferent(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceGt(message, attribute, rule, parameters) {
      const value = this.validator.getValue(parameters[0]);
      return this.replace(message, {
        value: value ? this.validator.getSize(parameters[0], value) : this.validator.getDisplayableAttribute(parameters[0]),
      });
    }
    replaceGte(message, attribute, rule, parameters) {
      return this.replaceGt(message, attribute, rule, parameters);
    }
    replaceLt(message, attribute, rule, parameters) {
      return this.replaceGt(message, attribute, rule, parameters);
    }
    replaceLte(message, attribute, rule, parameters) {
      return this.replaceGt(message, attribute, rule, parameters);
    }
    // Dates
    replaceAfter(message, attribute, rule, parameters) {
      const other = parameters[0];
      return this.replace(message, {
        date: this.validator.hasAttribute(other) ? this.validator.getDisplayableAttribute(other) : other,
      });
    }
    replaceAfterOrEqual(message, attribute, rule, parameters) {
      return this.replaceAfter(message, attribute, rule, parameters);
    }
    replaceBefore(message, attribute, rule, parameters) {
      return this.replaceAfter(message, attribute, rule, parameters);
    }
    replaceBeforeOrEqual(message, attribute, rule, parameters) {
      return this.replaceAfter(message, attribute, rule, parameters);
    }
    replaceDateEquals(message, attribute, rule, parameters) {
      return this.replaceAfter(message, attribute, rule, parameters);
    }
    replaceDateFormat(message, attribute, rule, parameters) {
      return this.replace(message, {
        format: parameters[0],
      });
    }
    // Array
    replaceInArray(message, attribute, rule, parameters) {
      return this.replaceAcceptedIf(message, attribute, rule, parameters);
    }
    replaceIn(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    replaceNotIn(message, attribute, rule, parameters) {
      return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
    }
    // File
    replaceMimetypes(message, attribute, rule, parameters) {
      return this.replace(message, {
        values: parameters.join(', '),
      });
    }
    replaceMimes(message, attribute, rule, parameters) {
      return this.replaceMimetypes(message, attribute, rule, parameters);
    }
    replaceExtensions(message, attribute, rule, parameters) {
      return this.replaceMimetypes(message, attribute, rule, parameters);
    }
  }

  class Validator {
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
    #implicitAttributes;
    #stopOnFirstFailure;
    #alwaysBail;
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
      this.#implicitAttributes = {};
      this.#stopOnFirstFailure = false;
      this.#alwaysBail = false;
      this.fileRules = ['file', 'image', 'mimetypes', 'mimes'];
      this.numericRules = ['decimal', 'numeric', 'integer'];
      this.sizeRules = ['size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte'];
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
          const parsedAttributeRules = {};
          for (const attributeRule of this.parseAttributeRules(attributeRules)) {
            const [rule, parameters] = this.parseAttributeRule(attributeRule);
            parsedAttributeRules[rule] = parameters;
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
      } else {
        return String(rules).split('|');
      }
    }
    parseAttributeRule(rule) {
      if (Array.isArray(rule)) {
        return [rule.shift() ?? '', rule];
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
      for (const [attribute, rules] of Object.entries(this.#rules)) {
        let value = this.getValue(attribute);
        if (Object.hasOwn(rules, 'sometimes') && typeof value === 'undefined') {
          continue;
        }
        tasks.push(async () => {
          const doBail = this.#alwaysBail || Object.hasOwn(rules, 'bail');
          const isNullable = Object.hasOwn(rules, 'nullable');
          let noError = true;
          for (const [rule, parameters] of Object.entries(rules)) {
            if (rule === '') {
              continue;
            }
            if (
              !Validator.#implicitRules.includes(rule) &&
              (typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '') || (isNullable && value === null))
            ) {
              continue;
            }
            let result, success, message;
            const camelRule = toCamelCase('check_' + rule);
            if (typeof this.#checkers[camelRule] === 'function') {
              result = await this.#checkers[camelRule](attribute, value, parameters);
            } else if (Validator.#dummyRules.includes(rule)) {
              result = true;
            } else {
              throw new Error(`Invalid validation rule: ${rule}`);
            }
            if (typeof result === 'boolean') {
              success = result;
            } else {
              ({ success, message } = result);
            }
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
      const camelRule = toCamelCase('replace_' + rule);
      if (typeof this.#replacers[camelRule] === 'function') {
        message = this.#replacers[camelRule](message, attribute, rule, parameters);
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
        if (this.#rules[attribute].hasOwnProperty(rule)) {
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
  }

  exports.Checkers = Checkers;
  exports.ErrorBag = ErrorBag;
  exports.Lang = Lang;
  exports.Replacers = Replacers;
  exports.Validator = Validator;

  return exports;
})({});
