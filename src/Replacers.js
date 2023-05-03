export default class Replacers {
  validator;

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
}
