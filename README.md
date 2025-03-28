# Quival

[![npm](https://img.shields.io/npm/v/quival?style=flat-square)](https://www.npmjs.com/package/quival)
[![npm downloads](https://img.shields.io/npm/dm/quival?style=flat-square)](https://www.npmjs.com/package/quival)
[![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/quival?style=flat-square)](https://cdn.jsdelivr.net/npm/quival@latest/)
[![License](https://img.shields.io/npm/l/quival?style=flat-square)](LICENSE.md)

This library provides the ability to perform data validation easily in JavaScript. It is heavily based on [Laravel Validation](https://laravel.com/docs/validation).

By sharing similar conventions, it is possible to reuse validation rules on both front and back ends. This library can be used for preliminary data validation on the front end, before submitting the data to Laravel-based app, where the data should be validated again. 

Why is there a need to perform validation on the front end? Early data validation allows an app to show errors to users immediately, before the data is even submitted. Live feedback is beneficial and can improve user experience.

This library is intended to be used in the browser environment, and it was not tested in other enviroments such as Node.

## Features

- Provide similar conventions to Laravel Validation
- Implement most of the rules listed [here](https://laravel.com/docs/validation#available-validation-rules)

## Installation

There are 2 ways to start using `quival` in your project.
- Use CDN link
- Import as a module

### Use CDN link

Get the script from [jsDelivr CDN page](https://www.jsdelivr.com/package/npm/quival) and include it in your HTML page.

```html
<script src="https://cdn.jsdelivr.net/npm/quival@0.5.x/dist/quival.min.js"></script>
```

Extract `Validator` class from  `quival` global variable, and you are good to go.

```js
const { Validator } = quival;

const validator = new Validator({ /* data */ }, { /* rules */ });
```

### Import as a module

Install the package first via NPM.

```bash
npm install quival
```

Import `Validator` class into your bundle, and you are good to go.

```js
import { Validator } from 'quival';

const validator = new Validator({ /* data */ }, { /* rules */ });
```

## JSFiddle Demos

- [Link dist version from CDN](https://jsfiddle.net/apih/dfn6yzw0)
- [Import src version from CDN](https://jsfiddle.net/apih/b1643pgm)
- [Form validation demo](https://jsfiddle.net/apih/6ya3wnhg)

## Usage Example

The code snippet below demonstrates the usage of `Validator` class.

```js
import { Validator } from 'quival';
import enLocale from 'quival/src/locales/en.js';

// Set localization messages
Validator.setLocale('en');
Validator.setMessages('en', enLocale);

// Register custom checker
Validator.addChecker(
  'phone_number',
  (attribute, value, parameters) => !/[^0-9\+\-\s]/.test(value),
  'The :attribute field must be a valid phone number.'
);

// Prepare arguments
const data = {
  refcode: '1bc',
  username: 'idea💡',
  name: '',
  email: 'test',
  phone_number: 'test',
  letters: ['a', 'b', 'B', 'a'],
  items: {
    x: 'a',
    y: null,
    z: 12,
  },
  payment_type: 'cc',
  card_number: '',
};

const rules = {
  refcode: [
    'required',
    function (attribute, value) { // Closure rule
      return {
        success: /^[a-z]/i.test(value),
        message: 'The :attribute field must start with a letter.',
      };
    },
  ],
  username: ['required', 'ascii', 'min:3'],
  name: ['required', 'min:3'],
  email: ['required', 'email'],
  phone_number: ['required', 'phone_number', 'min:7'],
  'letters.*': ['distinct:ignore_case'],
  items: ['array', 'size:5'],
  'items.*': ['required', 'string'],
  payment_type: ['required', 'in:cc,paypal'],
  cc_number: ['required_if:payment_type,cc'],
};

const customMessages = {
  'items.size': 'The size of the array must be equal to :size items only.',
};

const customAttributes = {
  cc_number: 'Credit Card Number',
};

const customValues = {
  payment_type: {
    cc: 'credit card',
  },
};

// Create Validator instance
const validator = new Validator(data, rules, customMessages, customAttributes, customValues);

// Perform validation
validator
  .validate()
  .then((errorBag) => {
    console.log(errorBag.messages());
  });
```

The produced error messages for the code snippet above.

```json
{
  "refcode": [
    "The refcode field must start with a letter."
  ],
  "username": [
    "The username field must only contain single-byte alphanumeric characters and symbols."
  ],
  "name": [
    "The name field is required."
  ],
  "email": [
    "The email field must be a valid email address."
  ],
  "phone_number": [
    "The phone number field must be a valid phone number.",
    "The phone number field must be at least 7 characters."
  ],
  "letters.0": [
    "The letters.0 field has a duplicate value."
  ],
  "letters.1": [
    "The letters.1 field has a duplicate value."
  ],
  "letters.2": [
    "The letters.2 field has a duplicate value."
  ],
  "letters.3": [
    "The letters.3 field has a duplicate value."
  ],
  "items": [
    "The size of the array must be equal to 5 items only."
  ],
  "items.y": [
    "The items.y field is required."
  ],
  "items.z": [
    "The items.z field must be a string."
  ],
  "cc_number": [
    "The Credit Card Number field is required when payment type is credit card."
  ]
}
```

## Unimplemented / Dummy Rules

The following rules are not implemented and will always pass the validation if used.

- `active_url`
- `can`
- `current_password`
- `exclude`
- `exclude_if`
- `exclude_unless`
- `exclude_with`
- `exclude_without`
- `exists`
- `unique`

You can implement custom rules to override the dummy rules, by using `Validator.addChecker()`.

## Security Vulnerabilities

If you discover any security related issues, please email <hafizuddin_83@yahoo.com> instead of using the issue tracker. Please prefix the subject with `Quival:`.

## Credits

- [Mohd Hafizuddin M Marzuki](https://github.com/apih)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
