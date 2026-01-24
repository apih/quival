import { escapeRegExp, flattenObject, isDigits, isEmpty, isNumeric, isPlainObject, isValidDate, parseDate, parseDateByFormat } from './helpers.js';

export default class Checkers {
  validator;
  #distinctCache = {};
  #imageCache = {};

  constructor(validator) {
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
      result.push(this.checkMissing(other, this.validator.getValue(other)));
    }

    if (callback(result)) {
      return this.checkMissing(attribute, value);
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
        otherValue = parseFloat(other);
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
  checkArray(attribute, value, parameters = []) {
    if (!(Array.isArray(value) || isPlainObject(value))) {
      return false;
    }

    if (parameters.length > 0) {
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

  checkBoolean(attribute, value, parameters = []) {
    if (parameters.includes('strict')) {
      return [true, false].includes(value);
    }

    return [true, false, 0, 1, '0', '1'].includes(value);
  }

  checkDate(attribute, value, parameters) {
    return isValidDate(parseDate(value));
  }

  checkFile(attribute, value, parameters) {
    return value instanceof File;
  }

  checkInteger(attribute, value, parameters = []) {
    if (!parameters.includes('strict') && typeof value === 'string') {
      value = parseFloat(value);
    }

    return Number.isInteger(value);
  }

  checkNumeric(attribute, value, parameters = []) {
    if (parameters.includes('strict')) {
      return typeof value === 'number';
    }

    return isNumeric(value);
  }

  checkString(attribute, value, parameters) {
    return typeof value === 'string';
  }

  // Numeric
  checkDecimal(attribute, value, parameters = []) {
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

  checkRequiredArrayKeys(attribute, value, parameters = []) {
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
    return typeof value === 'undefined';
  }

  checkMissingIf(attribute, value, parameters) {
    if (this.isDependent(parameters)) {
      return this.checkMissing(attribute, value);
    }

    return true;
  }

  checkMissingUnless(attribute, value, parameters) {
    if (!this.isDependent(parameters)) {
      return this.checkMissing(attribute, value);
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

  checkProhibits(attribute, value, parameters = []) {
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

  checkStartsWith(attribute, value, parameters = []) {
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

  checkEndsWith(attribute, value, parameters = []) {
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

  checkDifferent(attribute, value, parameters = []) {
    for (const parameter of parameters) {
      const other = this.validator.getValue(parameter);

      if (typeof other !== 'undefined' && value === other) {
        return false;
      }
    }

    return true;
  }

  checkConfirmed(attribute, value, parameters) {
    return this.checkSame(attribute, value, [parameters[0] ?? attribute + '_confirmation']);
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
  checkContains(attribute, value, parameters = []) {
    if (!this.checkArray(attribute, value)) {
      return false;
    }

    for (const parameter of parameters) {
      if (!value.includes(parameter)) {
        return false;
      }
    }

    return true;
  }

  checkDoesntContain(attribute, value, parameters = []) {
    if (!this.checkArray(attribute, value)) {
      return false;
    }

    for (const parameter of parameters) {
      if (value.includes(parameter)) {
        return false;
      }
    }

    return true;
  }

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

  checkMimes(attribute, value, parameters = []) {
    if (!this.checkFile(attribute, value)) {
      return false;
    }

    if (parameters.includes('jpg') && !parameters.includes('jpeg')) {
      parameters.push('jpeg');
    }

    if (parameters.includes('jpeg') && !parameters.includes('jpg')) {
      parameters.push('jpg');
    }

    return parameters.includes(value.name.split('.').pop().toLowerCase());
  }

  checkExtensions(attribute, value, parameters) {
    return this.checkMimes(attribute, value, parameters);
  }

  async checkImage(attribute, value, parameters = []) {
    const mimes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (parameters.includes('allow_svg')) {
      mimes.push('svg');
    }

    let result = this.checkMimes(attribute, value, mimes);

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

  async checkDimensions(attribute, value, parameters = []) {
    if (!(await this.checkImage(attribute, value)) || !Object.hasOwn(this.#imageCache, attribute)) {
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
      Intl.DateTimeFormat(undefined, { timeZone: value });
    } catch (error) {
      if (error instanceof RangeError) {
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
    return /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value);
  }

  checkUuid(attribute, value, parameters) {
    return /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(value);
  }
}
