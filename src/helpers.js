export function toCamelCase(string) {
  return string
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(\s\w)/g, (match) => match[1].toUpperCase());
}

export function toSnakeCase(string) {
  return string.replace(/(.)(?=[A-Z])/g, (match) => match + '_').toLowerCase();
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getByPath(obj, path, defaultValue) {
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

export function setByPath(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys.slice(0, -1)) {
    if (!Object.hasOwn(current, key)) {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys.at(-1)] = value;
}

export function flattenObject(obj, prefix = '') {
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

export function parseCsvString(value) {
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

export function parseDate(value) {
  if (value instanceof Date) {
    return value;
  } else if (isEmpty(value) || typeof value !== 'string') {
    return new Date('');
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

export function parseDateByFormat(value, format) {
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

export function isDigits(value) {
  return String(value).search(/[^0-9]/) === -1;
}

export function isEmpty(value) {
  return value === '' || value === null || typeof value === 'undefined';
}

export function isNumeric(value) {
  const number = Number(value);

  return value !== null && typeof value !== 'boolean' && typeof number === 'number' && !isNaN(number);
}

export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isValidDate(value) {
  return value instanceof Date && value.toDateString() !== 'Invalid Date';
}
