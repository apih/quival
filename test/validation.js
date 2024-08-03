import { strict as assert } from 'assert';
import Validator from '../src/Validator.js';

globalThis.File = class {
  name;
  size;
  type;

  constructor(name, size, type) {
    this.name = name;
    this.size = size;
    this.type = type;
  }
};

describe('Validation', () => {
  describe(`Empty rule`, () => {
    it(`Passes when the rule is empty`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: '' });
      assert(await validator.passes());

      validator.setRules({ field: ['', ''] });
      assert(await validator.passes());
    });
  });

  describe(`Rule 'accepted'`, () => {
    const rules = { field: 'accepted' };

    it(`Passes when the field is within accepted values`, async () => {
      const validator = new Validator({}, rules);

      for (const field of ['yes', 'on', '1', 1, true, 'true']) {
        validator.setData({ field });
        assert(await validator.passes());
      }
    });

    it(`Fails when the field is not within accepted values`, async () => {
      const validator = new Validator({}, rules);

      for (const field of ['no', 'off', '0', 0, false, 'false']) {
        validator.setData({ field });
        assert(await validator.fails());
      }
    });

    it(`Fails when the field is not present, empty or null`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.fails());

      validator.setData({ field: '' });
      assert(await validator.fails());

      validator.setData({ field: null });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'accepted_if'`, () => {
    const rules = { field: 'accepted_if:other,foo' };

    it(`Passes when accepted if the other field's value is equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when declined if the other field's value is equal to provided value`, async () => {
      const validator = new Validator({ field: false, other: 'foo' }, rules);
      assert(await validator.fails());
    });

    it(`Passes when declined if the other field's value is not equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when accepted if the other field's value is not equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'bar' }, rules);
      assert(await validator.passes());
    });
  });

  describe(`Rule 'after'`, () => {
    const date = '2022-01-01';
    const rules1 = { field: `after:${date}` };
    const rules2 = { field: 'after:date' };

    it(`Passes when the field is after ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-02' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is after the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-02', date }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when the field is equal to ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-01' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is equal to the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-01', date }, rules2);
      assert(await validator.fails());
    });

    it(`Fails when the field is before ${date}`, async () => {
      const validator = new Validator({ field: '2021-12-31' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is before the other field's value`, async () => {
      const validator = new Validator({ field: '2021-12-31', date }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'after_or_equal'`, () => {
    const date = '2022-01-01';
    const rules1 = { field: `after_or_equal:${date}` };
    const rules2 = { field: 'after_or_equal:date' };

    it(`Passes when the field is after ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-02' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is after the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-02', date }, rules2);
      assert(await validator.passes());
    });

    it(`Passes when the field is equal to ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-01' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is equal to the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-01', date }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when the field is before ${date}`, async () => {
      const validator = new Validator({ field: '2021-12-31' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is before the other field's value`, async () => {
      const validator = new Validator({ field: '2021-12-31', date }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'alpha'`, () => {
    const rules = { field: 'alpha' };

    it(`Passes when the field contains alphabets`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field contains numbers`, async () => {
      const validator = new Validator({ field: 'abc123' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field contains symbols`, async () => {
      const validator = new Validator({ field: 'abc!@' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'alpha_dash'`, () => {
    const rules = { field: 'alpha_dash' };

    it(`Passes when the field contains alphabets`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field contains numbers`, async () => {
      const validator = new Validator({ field: 'abc123' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field contains dashes and underscores`, async () => {
      const validator = new Validator({ field: 'abc123-_' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field contains other symbols`, async () => {
      const validator = new Validator({ field: 'abc!@' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'alpha_num'`, () => {
    const rules = { field: 'alpha_num' };

    it(`Passes when the field contains alphabets`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field contains numbers`, async () => {
      const validator = new Validator({ field: 'abc123' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field contains symbols`, async () => {
      const validator = new Validator({ field: 'abc!@' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'array'`, () => {
    const rules = { field: 'array' };
    const rules2 = { field: 'array:x,y,z' };

    it(`Passes when the field is an array or a plain object`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, rules);
      assert(await validator.passes());

      validator.setData({ field: { x: 1, y: 2, z: 3 } });
      assert(await validator.passes());
    });

    it(`Fails when the field is not an array or a plain object`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());
    });

    it(`Passes when keys are present in the array`, async () => {
      const validator = new Validator({ field: { x: 1, y: 2, z: 3 } }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when keys are not present in the array`, async () => {
      const validator = new Validator({ field: { a: 1, b: 2 } }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ascii'`, () => {
    const rules = { field: 'ascii' };

    it(`Passes when the field contains only ascii characters`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());

      validator.setData({ field: '123' });
      assert(await validator.passes());
    });

    it(`Fails when the field contains non-ascii characters`, async () => {
      const validator = new Validator({ field: 'ḁḅḉ' }, rules);
      assert(await validator.fails());

      validator.setData({ field: '۱۲۳' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'bail'`, () => {
    it(`Passes when the field is null`, async () => {
      const validator = new Validator({ field: '@bc' }, { field: 'bail|string|alpha|min:5' });

      assert.deepEqual((await validator.validate()).messages(), {
        field: ['validation.alpha'],
      });
    });
  });

  describe(`Rule 'before'`, () => {
    const date = '2022-01-01';
    const rules1 = { field: `before:${date}` };
    const rules2 = { field: 'before:date' };

    it(`Passes when the field is before ${date}`, async () => {
      const validator = new Validator({ field: '2021-12-31' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is before the other field's value`, async () => {
      const validator = new Validator({ field: '2021-12-31', date }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when the field is equal to ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-01' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is equal to the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-01', date }, rules2);
      assert(await validator.fails());
    });

    it(`Fails when the field is after ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-02' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is after the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-02', date }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'before_or_equal'`, () => {
    const date = '2022-01-01';
    const rules1 = { field: `before_or_equal:${date}` };
    const rules2 = { field: 'before_or_equal:date' };

    it(`Passes when the field is before ${date}`, async () => {
      const validator = new Validator({ field: '2021-12-31' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is before the other field's value`, async () => {
      const validator = new Validator({ field: '2021-12-31', date }, rules2);
      assert(await validator.passes());
    });

    it(`Passes when the field is equal to ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-01' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is equal to the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-01', date }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when the field is after ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-02' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is after the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-02', date }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'between'`, () => {
    const min = 5;
    const max = 10;

    it(`Passes when the array's size is between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: `array|between:${min},${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is not between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: `array|between:${min},${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the file's size is between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: `file|between:${min},${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the file's size is not between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: `file|between:${min},${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the number is between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: 7 }, { field: `numeric|between:${min},${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the number is not between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: 3 }, { field: `numeric|between:${min},${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the string's length is between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: 'abcdefg' }, { field: `string|between:${min},${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the string's length is not between ${min} and ${max}`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: `string|between:${min},${max}` });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'boolean'`, () => {
    const rules = { field: 'boolean' };

    it(`Passes when the field is a boolean`, async () => {
      const validator = new Validator({}, rules);

      for (const field of [true, false, 0, 1, '0', '1']) {
        validator.setData({ field });
        assert(await validator.passes());
      }
    });

    it(`Fails when the field is not a boolean`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'confirmed'`, () => {
    const rules = { field: 'confirmed' };

    it(`Passes when the field is confirmed`, async () => {
      const validator = new Validator({ field: 'abc', field_confirmation: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not confirmed`, async () => {
      const validator = new Validator({ field: 'abc', field_confirmation: 'xyz' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the confirmation field is not present`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'contains'`, () => {
    const rules = { field: 'contains:abc,def' };

    it(`Passes when the field contains required values`, async () => {
      const validator = new Validator({ field: ['abc', 'def', 'ghi'] }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field does not contain required values`, async () => {
      const validator = new Validator({ field: ['def', 'ghi'] }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is not an array`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'date'`, () => {
    const rules = { field: 'date' };

    it(`Passes when the field is a valid date`, async () => {
      const validator = new Validator({ field: '2023-01-01' }, rules);
      assert(await validator.passes());

      validator.setData({ field: '01-01-2023' });
      assert(await validator.passes());
    });

    it(`Fails when the field is not a valid date`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'date_equals'`, () => {
    const date = '2022-01-01';
    const rules1 = { field: `date_equals:${date}` };
    const rules2 = { field: 'date_equals:date' };

    it(`Passes when the field is equal to ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-01' }, rules1);
      assert(await validator.passes());
    });

    it(`Passes when the field is equal to other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-01', date }, rules2);
      assert(await validator.passes());
    });

    it(`Fails when the field is after ${date}`, async () => {
      const validator = new Validator({ field: '2022-01-02' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is after the other field's value`, async () => {
      const validator = new Validator({ field: '2022-01-02', date }, rules2);
      assert(await validator.fails());
    });

    it(`Fails when the field is before ${date}`, async () => {
      const validator = new Validator({ field: '2021-12-31' }, rules1);
      assert(await validator.fails());
    });

    it(`Fails when the field is before the other field's value`, async () => {
      const validator = new Validator({ field: '2021-12-31', date }, rules2);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'date_format'`, () => {
    for (const [format, date] of Object.entries({
      'Y-m-d': '2023-12-31',
      'd-m-Y': '31-12-2023',
      'm-d-Y': '12-31-2023',
      'Y-m': '2023-31',
    })) {
      it(`Passes when the field matches the format ${format}`, async () => {
        const validator = new Validator({ field: date }, { field: `date_format:${format}` });
        assert(await validator.passes());
      });
    }

    for (const [format, date] of Object.entries({
      'Y-m-d': '2023-11',
      'd-m-Y': '31-2023',
      'm-d-Y': '31-2023',
      'Y-m': '2023-31-12',
    })) {
      it(`Fails when the field does not match the format ${format}`, async () => {
        const validator = new Validator({ field: date }, { field: `date_format:${format}` });
        assert(await validator.fails());
      });
    }
  });

  describe(`Rule 'decimal'`, () => {
    it(`Passes when the field has 2 decimal places`, async () => {
      const validator = new Validator({ field: '1.23' }, { field: 'decimal:2' });
      assert(await validator.passes());
    });

    it(`Fails when the field does not have 2 decimal places`, async () => {
      const validator = new Validator({ field: '1.234' }, { field: 'decimal:2' });
      assert(await validator.fails());
    });

    it(`Passes when the field's decimal places is between 2 and 4`, async () => {
      const validator = new Validator({ field: '1.234' }, { field: 'decimal:2,4' });
      assert(await validator.passes());
    });

    it(`Fails when the field's decimal places is not between 2 and 4`, async () => {
      const validator = new Validator({ field: '1.23456' }, { field: 'decimal:2,4' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'declined'`, () => {
    const rules = { field: 'declined' };

    it(`Passes when the field is within declined values`, async () => {
      const validator = new Validator({}, rules);

      for (const field of ['no', 'off', '0', 0, false, 'false']) {
        validator.setData({ field });
        assert(await validator.passes());
      }
    });

    it(`Fails when the field is not within declined values`, async () => {
      const validator = new Validator({}, rules);

      for (const field of ['yes', 'on', '1', 1, true, 'true']) {
        validator.setData({ field });
        assert(await validator.fails());
      }
    });

    it(`Fails when the field is not present, empty or null`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.fails());

      validator.setData({ field: '' });
      assert(await validator.fails());

      validator.setData({ field: null });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'declined_if'`, () => {
    const rules = { field: 'declined_if:other,foo' };

    it(`Passes when declined if the other field's value is equal to provided value`, async () => {
      const validator = new Validator({ field: false, other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when accepted if the other field's value is equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'foo' }, rules);
      assert(await validator.fails());
    });

    it(`Passes when declined if the other field's value is not equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when accepted if the other field's value is not equal to provided value`, async () => {
      const validator = new Validator({ field: true, other: 'bar' }, rules);
      assert(await validator.passes());
    });
  });

  describe(`Rule 'different'`, () => {
    const rules = { field: 'different:other,foo' };

    it(`Passes when the field is different to the other field`, async () => {
      const validator = new Validator({ field: 'foo', other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is same to the other field`, async () => {
      const validator = new Validator({ field: 'foo', other: 'foo' }, rules);
      assert(await validator.fails());
    });

    it(`Passes when the other field is not present`, async () => {
      const validator = new Validator({ field: 'foo' }, rules);
      assert(await validator.passes());
    });
  });

  describe(`Rule 'digits'`, () => {
    const rules = { field: 'digits:3' };

    it(`Passes when the field has 3 digits`, async () => {
      const validator = new Validator({ field: '123' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field has less than 3 digits`, async () => {
      const validator = new Validator({ field: '12' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field has more than 3 digits`, async () => {
      const validator = new Validator({ field: '1234' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'digits_between'`, () => {
    const min = 3;
    const max = 5;
    const rules = { field: `digits_between:${min},${max}` };

    it(`Passes when the field has digits in between ${min} and ${max} digits`, async () => {
      const validator = new Validator({ field: '1234' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field has less than ${min} digits`, async () => {
      const validator = new Validator({ field: '12' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field has more than ${max} digits`, async () => {
      const validator = new Validator({ field: '123456' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'distinct'`, () => {
    it(`Passes when the field are distinctive`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4] }, { 'field.*': 'distinct' });
      assert(await validator.passes());
    });

    it(`Passes when the field are distinctive in strict mode`, async () => {
      const validator = new Validator({ field: [1, 3, '3', 7] }, { 'field.*': 'distinct:strict' });
      assert(await validator.passes());
    });

    it(`Passes when the field are distinctive in ignore_case mode`, async () => {
      const validator = new Validator({ field: ['a', 'b', 'c', 'd'] }, { 'field.*': 'distinct:ignore_case' });
      assert(await validator.passes());
    });

    it(`Fails when the field are not distinctive`, async () => {
      const validator = new Validator({ field: [1, 3, '3', 7] }, { 'field.*': 'distinct' });
      assert(await validator.fails());
    });

    it(`Fails when the field are not distinctive in strict mode`, async () => {
      const validator = new Validator({ field: [1, 3, 3, 7] }, { 'field.*': 'distinct:strict' });
      assert(await validator.fails());
    });

    it(`Fails when the field are not distinctive in ignore_case mode`, async () => {
      const validator = new Validator({ field: ['a', 'b', 'B', 'A'] }, { 'field.*': 'distinct:ignore_case' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'doesnt_end_with'`, () => {
    const rules = { field: 'doesnt_end_with:foo,bar' };

    it(`Passes when the field does not end with any value`, async () => {
      const validator = new Validator({ field: 'yes' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field ends with the first value`, async () => {
      const validator = new Validator({ field: 'yesfoo' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field ends with the second value`, async () => {
      const validator = new Validator({ field: 'yesbar' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'doesnt_start_with'`, () => {
    const rules = { field: 'doesnt_start_with:foo,bar' };

    it(`Passes when the field does not start with any value`, async () => {
      const validator = new Validator({ field: 'yes' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field starts with the first value`, async () => {
      const validator = new Validator({ field: 'fooyes' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field starts with the second value`, async () => {
      const validator = new Validator({ field: 'baryes' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'email'`, () => {
    const rules = { field: 'email' };

    it(`Passes when the field has a valid email address`, async () => {
      const validator = new Validator({ field: 'hafizuddin_83@yahoo.com' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field does not contains '@'`, async () => {
      const validator = new Validator({ field: 'hafizuddin_83yahoo.com' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field does not end with a domain name`, async () => {
      const validator = new Validator({ field: 'hafizuddin_83@yahoo' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ends_with'`, () => {
    const rules = { field: 'ends_with:foo,bar' };

    it(`Passes when the field ends with the first values`, async () => {
      const validator = new Validator({ field: 'yesfoo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field ends with the second values`, async () => {
      const validator = new Validator({ field: 'yesbar' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field does not end with any value`, async () => {
      const validator = new Validator({ field: 'yes' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'extensions'`, () => {
    const rules = { field: 'extensions:jpg,png' };

    it(`Passes when the field has a valid extension`, async () => {
      const validator = new Validator({ field: new File('hello.jpg', 5 * 1024, 'image/jpeg') }, rules);
      assert(await validator.passes());

      validator.setData({ field: new File('hello.png', 5 * 1024, 'image/png') });
      assert(await validator.passes());
    });

    it(`Fails when the field has an invalid extension`, async () => {
      const validator = new Validator({ field: new File('hello.doc', 5 * 1024, 'application/msword') }, rules);
      assert(await validator.fails());

      validator.setData({ field: new File('hello.txt', 5 * 1024, 'text/plain') });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'file'`, () => {
    const rules = { field: 'file' };

    it(`Passes when the field is a file`, async () => {
      const validator = new Validator({ field: new File('', 5 * 1024, '') }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not a file`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'filled'`, () => {
    const rules = { field: 'filled' };

    it(`Passes when the field is filled`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is not present`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty or null`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.fails());

      validator.setData({ field: null });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'gt'`, () => {
    it(`Passes when the array's size is greater than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: 'array|gt:3' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is greater than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6], other: [1, 2, 3] }, { field: 'array|gt:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is greater than provided value`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: 'file|gt:3' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is greater than other field`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|gt:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is greater than provided value`, async () => {
      const validator = new Validator({ field: 6 }, { field: 'numeric|gt:3' });
      assert(await validator.passes());
    });

    it(`Passes when the number is greater than other field`, async () => {
      const validator = new Validator({ field: 6, other: 3 }, { field: 'numeric|gt:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is greater than provided value`, async () => {
      const validator = new Validator({ field: 'abcdef' }, { field: 'string|gt:3' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is greater than other field`, async () => {
      const validator = new Validator({ field: 'abcdef', other: 'abc' }, { field: 'string|gt:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is equal to provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|gt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is equal to other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3] }, { field: 'array|gt:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is is equal to provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|gt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is is equal to other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|gt:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is equal to provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|gt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the number is equal to other field`, async () => {
      const validator = new Validator({ field: 3, other: 3 }, { field: 'numeric|gt:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is equal to provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|gt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is equal to other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abc' }, { field: 'string|gt:other', other: 'string' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|gt:6' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is lesser than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3, 4, 5, 6] }, { field: 'array|gt:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|gt:6' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is lesser than other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 6 * 1024, '') }, { field: 'file|gt:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is lesser than provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|gt:6' });
      assert(await validator.fails());
    });

    it(`Fails when the number is lesser than other field`, async () => {
      const validator = new Validator({ field: 3, other: 6 }, { field: 'numeric|gt:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is lesser than provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|gt:6' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is lesser than other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abcdef' }, { field: 'string|gt:other', other: 'string' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'gte'`, () => {
    it(`Passes when the array's size is greater than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: 'array|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is greater than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6], other: [1, 2, 3] }, { field: 'array|gte:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is greater than provided value`, async () => {
      const validator = new Validator({ field: new File('', 66 * 1024, '') }, { field: 'file|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is greater than other field`, async () => {
      const validator = new Validator({ field: new File('', 66 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|gte:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is greater than provided value`, async () => {
      const validator = new Validator({ field: 6 }, { field: 'numeric|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the number is greater than other field`, async () => {
      const validator = new Validator({ field: 6, other: 3 }, { field: 'numeric|gte:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is greater than provided value`, async () => {
      const validator = new Validator({ field: 'abcdef' }, { field: 'string|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is greater than other field`, async () => {
      const validator = new Validator({ field: 'abcdef', other: 'abc' }, { field: 'string|gte:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3] }, { field: 'array|gte:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|gte:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to other field`, async () => {
      const validator = new Validator({ field: 3, other: 3 }, { field: 'numeric|gte:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|gte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abc' }, { field: 'string|gte:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|gte:6' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is lesser than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3, 4, 5, 6] }, { field: 'array|gte:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|gte:6' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is lesser than other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 6 * 1024, '') }, { field: 'file|gte:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is lesser than provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|gte:6' });
      assert(await validator.fails());
    });

    it(`Fails when the number is lesser than other field`, async () => {
      const validator = new Validator({ field: 3, other: 6 }, { field: 'numeric|gte:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is lesser than provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|gte:6' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is lesser than other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abcdef' }, { field: 'string|gte:other', other: 'string' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'hex_color'`, () => {
    it(`Passes when the field is a valid color`, async () => {
      const validator = new Validator(
        {
          field_1: '#abc',
          field_2: '#abcd',
          field_3: '#abcabc',
          field_4: '#abcdabcd',
        },
        {
          field_1: 'hex_color',
          field_2: 'hex_color',
          field_3: 'hex_color',
          field_4: 'hex_color',
        },
      );

      assert(await validator.passes());
    });

    it(`Fails when the field is not a valid color`, async () => {
      const validator = new Validator(
        {
          field_1: '#ghi',
          field_2: '#ghij',
          field_3: '#ghighi',
          field_4: '#ghijghij',
          field_5: 'abc',
          field_6: 123,
          field_7: [1, 2, 3],
        },
        {
          field_1: 'hex_color',
          field_2: 'hex_color',
          field_3: 'hex_color',
          field_4: 'hex_color',
          field_5: 'hex_color',
          field_6: 'hex_color',
          field_7: 'hex_color',
        },
      );

      assert(await validator.fails());
    });

    it(`Fails when the color's value is not 3, 4, 6 or 8 digits.`, async () => {
      const validator = new Validator(
        {
          field_1: '#1',
          field_2: '#12',
          field_3: '#12345',
          field_4: '#1234567',
          field_4: '#123456789',
        },
        {
          field_1: 'hex_color',
          field_2: 'hex_color',
          field_3: 'hex_color',
          field_4: 'hex_color',
        },
      );

      assert(await validator.fails());
    });
  });

  describe(`Rule 'image'`, () => {
    const rules = { field: 'image' };

    it(`Passes when the field is an image`, async () => {
      const validator = new Validator({ field: new File('hello.jpg', 5 * 1024, 'image/jpeg') }, rules);
      assert(await validator.passes());

      validator.setData({ field: new File('hello.jpeg', 5 * 1024, 'image/jpeg') }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not an image`, async () => {
      const validator = new Validator({ field: new File('hello.txt', 5 * 1024, 'text/plain') }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'in'`, () => {
    it(`Passes when the field's value is in the list`, async () => {
      const validator = new Validator({ field: 'y' }, { field: 'in:x,y,z' });
      assert(await validator.passes());
    });

    it(`Passes when the field's values are in the list`, async () => {
      const validator = new Validator({ field: ['y', 'z'] }, { field: 'array|in:x,y,z' });
      assert(await validator.passes());
    });

    it(`Fails when the field's value is not in the list`, async () => {
      const validator = new Validator({ field: 'a' }, { field: 'in:x,y,z' });
      assert(await validator.fails());
    });

    it(`Fails when the field's values are not in the list`, async () => {
      const validator = new Validator({ field: ['a', 'z'] }, { field: 'array|in:x,y,z' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'in_array'`, () => {
    const rules = { field: 'in_array:other.*' };

    it(`Passes when the field is in the other field`, async () => {
      const validator = new Validator({ field: 'y', other: ['x', 'y', 'z'] }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not in the other field`, async () => {
      const validator = new Validator({ field: 'c', other: ['x', 'y', 'z'] }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'integer'`, () => {
    const rules = { field: 'integer' };

    it(`Passes when the field is an integer`, async () => {
      const validator = new Validator({ field: 123 }, rules);
      assert(await validator.passes());

      validator.setData({ field: '123' });
      assert(await validator.passes());
    });

    it(`Fails when the field is a decimal`, async () => {
      const validator = new Validator({ field: 123.45 }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is not a number`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ip'`, () => {
    const rules = { field: 'ip' };

    it(`Passes when the field is a valid IP address`, async () => {
      const validator = new Validator({ field: '127.0.0.1' }, rules);
      assert(await validator.passes());

      validator.setData({ field: '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF' });
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid IP address`, async () => {
      const validator = new Validator({ field: '127.x.x.1' }, rules);
      assert(await validator.fails());

      validator.setData({ field: '2001:db8:3333:x:x:DDDD:EEEE:FFFF' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ipv4'`, () => {
    const rules = { field: 'ipv4' };

    it(`Passes when the field is a valid IPv4 address`, async () => {
      const validator = new Validator({ field: '127.0.0.1' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid IPv4 address`, async () => {
      const validator = new Validator({ field: '11.22.33' }, rules);
      assert(await validator.fails());

      validator.setData({ field: '256.23.33' });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ipv6'`, () => {
    const rules = { field: 'ipv6' };

    it(`Passes when the field is a valid IPv6 address`, async () => {
      const validator = new Validator({ field: '2001:0db8:0000:0000:0000:ff00:0042:8329' }, rules);
      assert(await validator.passes());

      validator.setData({ field: '2001:db8::ff00:42:8329' });
      assert(await validator.passes());

      validator.setData({ field: '::1' });
      assert(await validator.passes());

      validator.setData({ field: '4::' });
      assert(await validator.passes());

      validator.setData({ field: '::' });
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid IPv6 address`, async () => {
      const validator = new Validator({ field: '196.168.0.1' }, rules);
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: '1:::2' });
      assert(await validator.fails());

      validator.setData({ field: '2001::3333:4444:CCCC:DDDD::EEEE:FFFF' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'json'`, () => {
    const rules = { field: 'json' };

    it(`Passes when the field is a valid JSON string`, async () => {
      const validator = new Validator({ field: '[1,2,3]' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid JSON string`, async () => {
      const validator = new Validator({ field: '[1,2,3' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'list'`, () => {
    const rules = { field: 'list' };

    it(`Passes when the field is a list`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not a list`, async () => {
      const validator = new Validator({ field: { a: 1, b: 2, c: 3 } }, rules);
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'lowercase'`, () => {
    const rules = { field: 'lowercase' };

    it(`Passes when the field is fully lowercased`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is partially lowercased`, async () => {
      const validator = new Validator({ field: 'ABc' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is fully uppercased`, async () => {
      const validator = new Validator({ field: 'ABC' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'lt'`, () => {
    it(`Passes when the array's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|lt:6' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is lesser than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3, 4, 5, 6] }, { field: 'array|lt:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|lt:6' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is lesser than other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 6 * 1024, '') }, { field: 'file|lt:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is lesser than provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|lt:6' });
      assert(await validator.passes());
    });

    it(`Passes when the number is lesser than other field`, async () => {
      const validator = new Validator({ field: 3, other: 6 }, { field: 'numeric|lt:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is lesser than provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|lt:6' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is lesser than other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abcdef' }, { field: 'string|lt:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is equal to provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is equal to other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3] }, { field: 'array|lt:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is equal to provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is equal to other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|lt:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is equal to provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the number is equal to other field`, async () => {
      const validator = new Validator({ field: 3, other: 3 }, { field: 'numeric|lt:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is equal to provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is equal to other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abc' }, { field: 'string|lt:other', other: 'string' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is greater than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: 'array|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is greater than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6], other: [1, 2, 3] }, { field: 'array|lt:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is greater than provided value`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: 'file|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is greater than other field`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, ''), other: new File('', 6 * 1024, '') }, { field: 'file|lt:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is greater than provided value`, async () => {
      const validator = new Validator({ field: 6 }, { field: 'numeric|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the number is greater than other field`, async () => {
      const validator = new Validator({ field: 6, other: 3 }, { field: 'numeric|lt:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is greater than provided value`, async () => {
      const validator = new Validator({ field: 'abcdef' }, { field: 'string|lt:3' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is greater than other field`, async () => {
      const validator = new Validator({ field: 'abcdef', other: 'abc' }, { field: 'string|lt:other', other: 'string' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'lte'`, () => {
    it(`Passes when the array's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|lte:6' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is lesser than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3, 4, 5, 6] }, { field: 'array|lte:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is lesser than provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|lte:6' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is lesser than other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 6 * 1024, '') }, { field: 'file|lte:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is lesser than provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|lte:6' });
      assert(await validator.passes());
    });

    it(`Passes when the number is lesser than other field`, async () => {
      const validator = new Validator({ field: 3, other: 6 }, { field: 'numeric|lte:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is lesser than provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|lte:6' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is lesser than other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abcdef' }, { field: 'string|lte:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: 'array|lte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3], other: [1, 2, 3] }, { field: 'array|lte:other', other: 'array' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to provided value`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: 'file|lte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to other field`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|lte:other', other: 'file' });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to provided value`, async () => {
      const validator = new Validator({ field: 3 }, { field: 'numeric|lte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to other field`, async () => {
      const validator = new Validator({ field: 3, other: 3 }, { field: 'numeric|lte:other', other: 'numeric' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to provided value`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'string|lte:3' });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to other field`, async () => {
      const validator = new Validator({ field: 'abc', other: 'abc' }, { field: 'string|lte:other', other: 'string' });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is greater than provided value`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: 'array|lte:3' });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is greater than other field`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6], other: [1, 2, 3] }, { field: 'array|lte:other', other: 'array' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is greater than provided value`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: 'file|lte:3' });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is greater than other field`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, ''), other: new File('', 3 * 1024, '') }, { field: 'file|lte:other', other: 'file' });
      assert(await validator.fails());
    });

    it(`Fails when the number is greater than provided value`, async () => {
      const validator = new Validator({ field: 6 }, { field: 'numeric|lte:3' });
      assert(await validator.fails());
    });

    it(`Fails when the number is greater than other field`, async () => {
      const validator = new Validator({ field: 6, other: 3 }, { field: 'numeric|lte:other', other: 'numeric' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is greater than provided value`, async () => {
      const validator = new Validator({ field: 'abcdef' }, { field: 'string|lte:3' });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is greater than other field`, async () => {
      const validator = new Validator({ field: 'abcdef', other: 'abc' }, { field: 'string|lte:other', other: 'string' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'mac_address'`, () => {
    const rules = { field: 'mac_address' };

    it(`Passes when the field contains a valid MAC address`, async () => {
      const validator = new Validator({ field: '01-23-45-67-89-AB' }, rules);
      assert(await validator.passes());

      validator.setData({ field: '01:23:45:67:89:AB' });
      assert(await validator.passes());

      validator.setData({ field: '0123.4567.89AB' });
      assert(await validator.passes());
    });

    it(`Fails when the field contains an invalid MAC address`, async () => {
      const validator = new Validator({ field: 'X1-23-45-67-89-AB' }, rules);
      assert(await validator.fails());

      validator.setData({ field: '01:23:45:67:89' });
      assert(await validator.fails());

      validator.setData({ field: '0123.4567.89AB.1337' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'max'`, () => {
    const max = 5;

    it(`Passes when the array's size is lesser than ${max}`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: `array|max:${max}` });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to ${max}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5] }, { field: `array|max:${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is greater than ${max}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: `array|max:${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the file's size is lesser than ${max}`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: `file|max:${max}` });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to ${max}`, async () => {
      const validator = new Validator({ field: new File('', 5 * 1024, '') }, { field: `file|max:${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the file's size is greater than ${max}`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: `file|max:${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the number is lesser than ${max}`, async () => {
      const validator = new Validator({ field: 4 }, { field: `numeric|max:${max}` });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to ${max}`, async () => {
      const validator = new Validator({ field: 5 }, { field: `numeric|max:${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the number is greater than ${max}`, async () => {
      const validator = new Validator({ field: 9 }, { field: `numeric|max:${max}` });
      assert(await validator.fails());
    });

    it(`Passes when the string's length is lesser than ${max}`, async () => {
      const validator = new Validator({ field: 'abcd' }, { field: `string|max:${max}` });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to ${max}`, async () => {
      const validator = new Validator({ field: 'abcde' }, { field: `string|max:${max}` });
      assert(await validator.passes());
    });

    it(`Fails when the string's length is greater than ${max}`, async () => {
      const validator = new Validator({ field: 'abcdefg' }, { field: `string|max:${max}` });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'max_digits'`, () => {
    const rules = { field: 'max_digits:3' };

    it(`Passes when the field has 3 digits`, async () => {
      const validator = new Validator({ field: '123' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field has less than 3 digits`, async () => {
      const validator = new Validator({ field: '12' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field has more than 3 digits`, async () => {
      const validator = new Validator({ field: '1234' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'mimes'`, () => {
    const rules = { field: 'mimes:jpg,png' };

    it(`Passes when the field has a valid extension`, async () => {
      const validator = new Validator({ field: new File('hello.jpg', 5 * 1024, 'image/jpeg') }, rules);
      assert(await validator.passes());

      validator.setData({ field: new File('hello.png', 5 * 1024, 'image/png') });
      assert(await validator.passes());
    });

    it(`Fails when the field has an invalid extension`, async () => {
      const validator = new Validator({ field: new File('hello.doc', 5 * 1024, 'application/msword') }, rules);
      assert(await validator.fails());

      validator.setData({ field: new File('hello.txt', 5 * 1024, 'text/plain') });
      assert(await validator.fails());
    });

    it(`Passes when the rule's parameter for JPEG file is defined as 'jpg' or 'jpeg'`, async () => {
      const validator = new Validator({ field: new File('hello.jpeg', 5 * 1024, 'image/jpeg') }, { field: 'mimes:jpg' });
      assert(await validator.passes());

      validator.setProperties({ field: new File('hello.jpg', 5 * 1024, 'image/jpeg') }, { field: 'mimes:jpeg' });
      assert(await validator.passes());
    });
  });

  describe(`Rule 'mimetypes'`, () => {
    const rules = { field: 'mimetypes:image/jpeg,image/png' };

    it(`Passes when the field has a valid type`, async () => {
      const validator = new Validator({ field: new File('hello.jpg', 5 * 1024, 'image/jpeg') }, rules);
      assert(await validator.passes());

      validator.setData({ field: new File('hello.png', 5 * 1024, 'image/png') });
      assert(await validator.passes());
    });

    it(`Fails when the field has an invalid type`, async () => {
      const validator = new Validator({ field: new File('hello.doc', 5 * 1024, 'application/msword') }, rules);
      assert(await validator.fails());

      validator.setData({ field: new File('hello.txt', 5 * 1024, 'text/plain') });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'min'`, () => {
    const min = 5;

    it(`Passes when the array's size is greater than ${min}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: `array|min:${min}` });
      assert(await validator.passes());
    });

    it(`Passes when the array's size is equal to ${min}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5] }, { field: `array|min:${min}` });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is lesser than ${min}`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: `array|min:${min}` });
      assert(await validator.fails());
    });

    it(`Passes when the file's size is greater than ${min}`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: `file|min:${min}` });
      assert(await validator.passes());
    });

    it(`Passes when the file's size is equal to ${min}`, async () => {
      const validator = new Validator({ field: new File('', 5 * 1024, '') }, { field: `file|min:${min}` });
      assert(await validator.passes());
    });

    it(`Fails when the file's size is lesser than ${min}`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: `file|min:${min}` });
      assert(await validator.fails());
    });

    it(`Passes when the number is greater than ${min}`, async () => {
      const validator = new Validator({ field: 9 }, { field: `numeric|min:${min}` });
      assert(await validator.passes());
    });

    it(`Passes when the number is equal to ${min}`, async () => {
      const validator = new Validator({ field: 5 }, { field: `numeric|min:${min}` });
      assert(await validator.passes());
    });

    it(`Fails when the number is lesser than ${min}`, async () => {
      const validator = new Validator({ field: 4 }, { field: `numeric|min:${min}` });
      assert(await validator.fails());
    });

    it(`Passes when the string's length is greater than ${min}`, async () => {
      const validator = new Validator({ field: 'abcdefg' }, { field: `string|min:${min}` });
      assert(await validator.passes());
    });

    it(`Passes when the string's length is equal to ${min}`, async () => {
      const validator = new Validator({ field: 'abcde' }, { field: `string|min:${min}` });
      assert(await validator.passes());
    });

    it(`Fails when the string's length is lesser than ${min}`, async () => {
      const validator = new Validator({ field: 'abcd' }, { field: `string|min:${min}` });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'min_digits'`, () => {
    const rules = { field: 'min_digits:3' };

    it(`Passes when the field has 3 digits`, async () => {
      const validator = new Validator({ field: '123' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field has more than 3 digits`, async () => {
      const validator = new Validator({ field: '1234' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field has less than 3 digits`, async () => {
      const validator = new Validator({ field: '12' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'missing'`, () => {
    const rules = { field: 'missing' };

    it(`Passes when the field is not present`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty or null`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.fails());

      validator.setData({ field: null });
      assert(await validator.fails());
    });

    it(`Fails when the field is filled`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'missing_if'`, () => {
    const rules = { field: 'missing_if:other,foo,bar' };

    it(`Passes when the field is present and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: '', other: 'bob' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is present and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: '', other: 'foo' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is present and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: '', other: 'bar' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'missing_unless'`, () => {
    const rules = { field: 'missing_unless:other,foo,bar' };

    it(`Passes when the field is not present and the other field's value is equal to any value`, async () => {
      const validator = new Validator({ other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is present and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: '', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is present and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: '', other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is present and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: '', other: 'bob' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'missing_with'`, () => {
    const rules = { field: 'missing_with:foo,bar' };

    it(`Passes when the field is present and no other fields are present`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is not present and no other fields present`, async () => {
      const validator = new Validator({ foo: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field and the first field are present`, async () => {
      const validator = new Validator({ field: '', foo: '' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field and the second field are present`, async () => {
      const validator = new Validator({ field: '', bar: '' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'missing_with_all'`, () => {
    const rules = { field: 'missing_with_all:foo,bar' };

    it(`Passes when the field is present and all other fields are not present`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is not present and all other fields are present`, async () => {
      const validator = new Validator({ foo: '', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is present and any other field is present`, async () => {
      const validator = new Validator({ field: '', foo: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is present and all other fields are present`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: '' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'multiple_of'`, () => {
    it(`Passes when the field is multiple of provided value`, async () => {
      const validator = new Validator({ field: 16 }, { field: 'multiple_of:4' });
      assert(await validator.passes());

      validator.setProperties({ field: 66 }, { field: 'multiple_of:11' });
      assert(await validator.passes());
    });

    it(`Fails when the field is not multiple of provided value`, async () => {
      const validator = new Validator({ field: 21 }, { field: 'multiple_of:4' });
      assert(await validator.fails());

      validator.setProperties({ field: 58 }, { field: 'multiple_of:11' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'not_in'`, () => {
    it(`Passes when the field's value is not in the list`, async () => {
      const validator = new Validator({ field: 'a' }, { field: 'not_in:x,y,z' });
      assert(await validator.passes());
    });

    it(`Passes when the field's values are not in the list`, async () => {
      const validator = new Validator({ field: ['j', 'k'] }, { field: 'array|not_in:x,y,z' });
      assert(await validator.passes());
    });

    it(`Fails when the field's value is in the list`, async () => {
      const validator = new Validator({ field: 'z' }, { field: 'not_in:x,y,z' });
      assert(await validator.fails());
    });

    it(`Fails when the field's values are in the list`, async () => {
      const validator = new Validator({ field: ['x', 'z'] }, { field: 'array|not_in:x,y,z' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'not_regex'`, () => {
    it(`Passes when the field does not contain alphabets`, async () => {
      const validator = new Validator({ field: '!123' }, { field: 'not_regex:/^[a-z]+$/i' });
      assert(await validator.passes());
    });

    it(`Passes when the field does not contain numbers`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'not_regex:/^[0-9]+$/' });
      assert(await validator.passes());
    });

    it(`Passes when the field does not contain symbols`, async () => {
      const validator = new Validator({ field: 'abc123' }, { field: 'not_regex:/^[^a-z0-9]+$/i' });
      assert(await validator.passes());
    });
  });

  describe(`Rule 'nullable'`, () => {
    const rules = { field: 'nullable|integer' };

    it(`Passes when the field is null`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is not null and is an integer`, async () => {
      const validator = new Validator({ field: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not null and is not an integer`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'numeric'`, () => {
    const rules = { field: 'numeric' };

    it(`Passes when the field is a number`, async () => {
      const validator = new Validator({ field: 123 }, rules);
      assert(await validator.passes());

      validator.setData({ field: '123.45' });
      assert(await validator.passes());
    });

    it(`Fails when the field is not a number`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'present'`, () => {
    const rules = { field: 'present' };

    it(`Passes when the field is present`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not present`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'prohibited'`, () => {
    const rules = { field: 'prohibited' };

    it(`Passes when the field is not present`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is null`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the array's size is 0`, async () => {
      const validator = new Validator({ field: [] }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is filled`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'prohibited_if'`, () => {
    const rules = { field: 'prohibited_if:other,foo,bar' };

    it(`Passes when the field is filled and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bob' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is filled and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'foo' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is filled and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bar' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'prohibited_unless'`, () => {
    const rules = { field: 'prohibited_unless:other,foo,bar' };

    it(`Passes when the field is filled and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: '', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is filled and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bob' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'prohibits'`, () => {
    const rules = { field: 'prohibits:foo,bar' };

    it(`Passes when the field is filled and all other fields are empty or null`, async () => {
      const validator = new Validator({ field: 'abc', foo: '', bar: null }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and all other fields are filled`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is filled and all other fields are filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: 123 }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is filled and any other field is filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: null }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'regex'`, () => {
    it(`Passes when the field contains alphabets`, async () => {
      const validator = new Validator({ field: 'abc' }, { field: 'regex:/^[a-z]+$/i' });
      assert(await validator.passes());
    });

    it(`Passes when the field contains numbers`, async () => {
      const validator = new Validator({ field: '123' }, { field: 'regex:/^[0-9]+$/' });
      assert(await validator.passes());
    });

    it(`Passes when the field contains symbols`, async () => {
      const validator = new Validator({ field: '!@#' }, { field: 'regex:/^[^a-z0-9]+$/i' });
      assert(await validator.passes());
    });
  });

  describe(`Rule 'required'`, () => {
    const rules = { field: 'required' };

    it(`Passes when the field is filled`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not present, empty or null`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.fails());

      validator.setData({ field: '' });
      assert(await validator.fails());

      validator.setData({ field: null });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is 0`, async () => {
      const validator = new Validator({ field: [] }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the file's size is 0`, async () => {
      const validator = new Validator({ field: new File('', 0, '') }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_array_keys'`, () => {
    const rules = { field: 'required_array_keys:x,y,z' };

    it(`Passes when all required keys are present`, async () => {
      const validator = new Validator({ field: { x: 1, y: 2, z: 3 } }, rules);
      assert(await validator.passes());
    });

    it(`Passes when all required keys are present, along with undeclared keys`, async () => {
      const validator = new Validator({ field: { w: 0, x: 1, y: 2, z: 3 } }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the any required key is missing`, async () => {
      const validator = new Validator({ field: { x: 1, y: 2 } }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_if'`, () => {
    const rules = { field: 'required_if:other,foo,bar' };

    it(`Passes when the field is filled and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bob' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and the other field's value is equal to any value`, async () => {
      const validator = new Validator({ field: '', other: 'bar' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_if_accepted'`, () => {
    const rules = { field: 'required_if_accepted:foo' };

    it(`Passes when the field is filled and the other field is accepted`, async () => {
      const validator = new Validator({ field: 'abc', foo: true }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field is declined`, async () => {
      const validator = new Validator({ field: 'abc', foo: false }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and the other field is declined`, async () => {
      const validator = new Validator({ field: '', foo: false }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and the other field is accepted`, async () => {
      const validator = new Validator({ field: '', foo: true }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_if_declined'`, () => {
    const rules = { field: 'required_if_declined:foo' };

    it(`Passes when the field is filled and the other field is declined`, async () => {
      const validator = new Validator({ field: 'abc', foo: false }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field is accepted`, async () => {
      const validator = new Validator({ field: 'abc', foo: true }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and the other field is accepted`, async () => {
      const validator = new Validator({ field: '', foo: true }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and the other field is declined`, async () => {
      const validator = new Validator({ field: '', foo: false }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_unless'`, () => {
    const rules = { field: 'required_unless:other,foo,bar' };

    it(`Passes when the field is empty and the other field's value is equal to the first value`, async () => {
      const validator = new Validator({ field: '', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and the other field's value is equal to the second value`, async () => {
      const validator = new Validator({ field: '', other: 'bar' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: 'abc', other: 'bob' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and the other field's value is not equal to any value`, async () => {
      const validator = new Validator({ field: '', other: 'bob' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_with'`, () => {
    const rules = { field: 'required_with:foo,bar' };

    it(`Passes when the field is filled and the first field is filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the second field is filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: '', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and all other fields are empty`, async () => {
      const validator = new Validator({ field: 'abc', foo: '', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and all other fields are empty`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and the first field is filled`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: '' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is empty and the second field is filled`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: 123 }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_with_all'`, () => {
    const rules = { field: 'required_with_all:foo,bar' };

    it(`Passes when the field is filled and all fields are filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and any field is filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and all fields are empty`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and any field is empty`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and all fields are filled`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: 123 }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_without'`, () => {
    const rules = { field: 'required_without:foo,bar' };

    it(`Passes when the field is filled and the first field is empty`, async () => {
      const validator = new Validator({ field: 'abc', foo: '', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and the second field is empty`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and all other fields are empty`, async () => {
      const validator = new Validator({ field: 'abc', foo: '', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and all other fields are empty`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: '' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is empty and the first field is filled`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: '' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is empty and the second field is filled`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: 123 }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'required_without_all'`, () => {
    const rules = { field: 'required_without_all:foo,bar' };

    it(`Passes when the field is filled and all fields are filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is filled and any field is filled`, async () => {
      const validator = new Validator({ field: 'abc', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and any field is empty`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: '' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field is empty and all fields are filled`, async () => {
      const validator = new Validator({ field: '', foo: 'abc', bar: 123 }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is empty and all fields are empty`, async () => {
      const validator = new Validator({ field: '', foo: '', bar: '' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'same'`, () => {
    const rules = { field: 'same:other' };

    it(`Passes when the field is equal to the other field`, async () => {
      const validator = new Validator({ field: 'foo', other: 'foo' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is different to the other field`, async () => {
      const validator = new Validator({ field: 'foo', other: 'bar' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the other field is not present`, async () => {
      const validator = new Validator({ field: 'foo' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'size'`, () => {
    const size = 5;

    it(`Passes when the array's size is equal to ${size}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5] }, { field: `array|size:${size}` });
      assert(await validator.passes());
    });

    it(`Fails when the array's size is lesser than ${size}`, async () => {
      const validator = new Validator({ field: [1, 2, 3] }, { field: `array|size:${size}` });
      assert(await validator.fails());
    });

    it(`Fails when the array's size is greater than ${size}`, async () => {
      const validator = new Validator({ field: [1, 2, 3, 4, 5, 6] }, { field: `array|size:${size}` });
      assert(await validator.fails());
    });

    it(`Passes when the file's size is equal to ${size}`, async () => {
      const validator = new Validator({ field: new File('', 5 * 1024, '') }, { field: `file|size:${size}` });
      assert(await validator.passes());
    });

    it(`Fails when the file's size is lesser than ${size}`, async () => {
      const validator = new Validator({ field: new File('', 3 * 1024, '') }, { field: `file|size:${size}` });
      assert(await validator.fails());
    });

    it(`Fails when the file's size is greater than ${size}`, async () => {
      const validator = new Validator({ field: new File('', 6 * 1024, '') }, { field: `file|size:${size}` });
      assert(await validator.fails());
    });

    it(`Passes when the number is equal to ${size}`, async () => {
      const validator = new Validator({ field: 5 }, { field: `numeric|size:${size}` });
      assert(await validator.passes());
    });

    it(`Fails when the number is lesser than ${size}`, async () => {
      const validator = new Validator({ field: 4 }, { field: `numeric|size:${size}` });
      assert(await validator.fails());
    });

    it(`Fails when the number is greater than ${size}`, async () => {
      const validator = new Validator({ field: 9 }, { field: `numeric|size:${size}` });
      assert(await validator.fails());
    });

    it(`Passes when the string's length is equal to ${size}`, async () => {
      const validator = new Validator({ field: 'abcde' }, { field: `string|size:${size}` });
      assert(await validator.passes());
    });

    it(`Fails when the string's length is lesser than ${size}`, async () => {
      const validator = new Validator({ field: 'abcd' }, { field: `string|size:${size}` });
      assert(await validator.fails());
    });

    it(`Fails when the string's length is greater than ${size}`, async () => {
      const validator = new Validator({ field: 'abcdefg' }, { field: `string|size:${size}` });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'sometimes'`, () => {
    const rules = { field: 'sometimes|required' };

    it(`Passes when the field does not exist`, async () => {
      const validator = new Validator({}, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field exists`, async () => {
      const validator = new Validator({ field: '' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'starts_with'`, () => {
    const rules = { field: 'starts_with:foo,bar' };

    it(`Passes when the field starts with the first values`, async () => {
      const validator = new Validator({ field: 'fooyes' }, rules);
      assert(await validator.passes());
    });

    it(`Passes when the field starts with the second values`, async () => {
      const validator = new Validator({ field: 'baryes' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field does not start with any value`, async () => {
      const validator = new Validator({ field: 'yes' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'string'`, () => {
    const rules = { field: 'string' };

    it(`Passes when the field is a string`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is not a string`, async () => {
      const validator = new Validator({ field: null }, rules);
      assert(await validator.fails());

      validator.setData({ field: true });
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: [1, 2, 3] });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'timezone'`, () => {
    const rules = { field: 'timezone' };

    it(`Passes when the field is a valid timezone`, async () => {
      const validator = new Validator({ field: 'UTC' }, rules);
      assert(await validator.passes());

      validator.setData({ field: 'Asia/Kuala_Lumpur' });
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid timezone`, async () => {
      const validator = new Validator({ field: 'Asia/Kelantan' }, rules);
      assert(await validator.fails());

      validator.setData({ field: 123 });
      assert(await validator.fails());

      validator.setData({ field: 'abc' });
      assert(await validator.fails());
    });
  });

  describe(`Rule 'uppercase'`, () => {
    const rules = { field: 'uppercase' };

    it(`Passes when the field is fully uppercased`, async () => {
      const validator = new Validator({ field: 'ABC' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is partially uppercased`, async () => {
      const validator = new Validator({ field: 'abC' }, rules);
      assert(await validator.fails());
    });

    it(`Fails when the field is fully lowercased`, async () => {
      const validator = new Validator({ field: 'abc' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'url'`, () => {
    const rules = { field: 'url' };

    it(`Passes when the field is a valid URL`, async () => {
      const validator = new Validator({ field: 'https://onpay.my' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid URL`, async () => {
      const validator = new Validator({ field: '//onpay.my' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'ulid'`, () => {
    const rules = { field: 'ulid' };

    it(`Passes when the field is a valid ULID`, async () => {
      const validator = new Validator({ field: '01GZPCVRPR6K3KQW5B9ESB8PH3' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid ULID`, async () => {
      const validator = new Validator({ field: '01GZPCVRPR6K3KOW5B9ESB8PH3' }, rules);
      assert(await validator.fails());
    });
  });

  describe(`Rule 'uuid'`, () => {
    const rules = { field: 'uuid' };

    it(`Passes when the field is a valid UUID`, async () => {
      const validator = new Validator({ field: '395dbfe1-3451-43f0-b295-337c00074099' }, rules);
      assert(await validator.passes());
    });

    it(`Fails when the field is an invalid UUID`, async () => {
      const validator = new Validator({ field: '395dbfe1-3451-x3f0-b295-337c00074099' }, rules);
      assert(await validator.fails());
    });
  });
});
