import { strict as assert } from 'assert';
import Validator from '../src/Validator.js';

describe('Functionalities', () => {
  it('Create a new instance', () => {
    const validator = new Validator({ field: 'abc' }, { field: 'string' });
    assert(validator instanceof Validator);
  });

  it('Validate data', async () => {
    const validator = new Validator(
      {
        val1: '@bc',
        val2: 123,
      },
      {
        val1: 'string|alpha|min:5',
        val2: 'string|alpha',
      },
    );

    assert.deepEqual((await validator.validate()).messages(), {
      val1: ['validation.alpha', 'validation.min'],
      val2: ['validation.string', 'validation.alpha'],
    });
  });

  it('Stop on first failure', async () => {
    const validator = new Validator(
      {
        val1: '@bc',
        val2: 123,
      },
      {
        val1: 'string|alpha|min:5',
        val2: 'string|alpha',
      },
    );

    validator.stopOnFirstFailure();

    assert.deepEqual((await validator.validate()).messages(), {
      val1: ['validation.alpha', 'validation.min'],
    });
  });

  it('Always bail', async () => {
    const validator = new Validator(
      {
        val1: '@bc',
        val2: 123,
      },
      {
        val1: 'string|alpha|min:5',
        val2: 'string|alpha',
      },
    );

    validator.alwaysBail();

    assert.deepEqual((await validator.validate()).messages(), {
      val1: ['validation.alpha'],
      val2: ['validation.string'],
    });
  });

  it('Stop on first failure and always bail', async () => {
    const validator = new Validator(
      {
        val1: '@bc',
        val2: 123,
      },
      {
        val1: 'string|alpha|min:5',
        val2: 'string|alpha',
      },
    );

    validator.stopOnFirstFailure().alwaysBail();

    assert.deepEqual((await validator.validate()).messages(), {
      val1: ['validation.alpha'],
    });
  });

  it('Convert placeholders to upper and title cases', async () => {
    const validator = new Validator(
      {
        val1: 'foo',
        val2: 'bar',
        val3: false,
        val4: false,
        val5: '',
        val6: '',
      },
      {
        val1: 'string|min:5',
        val2: 'string|min:5',
        val3: 'accepted_if:val1,foo',
        val4: 'accepted_if:val2,bar',
        val5: 'required_with:val1,foo',
        val6: 'required_with:val2,bar',
      },
      {
        'val1.min': ':Attribute',
        'val2.min': ':ATTRIBUTE',
        'val3.accepted_if': ':Other',
        'val4.accepted_if': ':OTHER',
        'val5.required_with': ':Attribute :VALUES',
        'val6.required_with': ':ATTRIBUTE :Values',
      },
    );

    assert.deepEqual((await validator.validate()).messages(), {
      val1: ['Val1'],
      val2: ['VAL2'],
      val3: ['Val1'],
      val4: ['VAL2'],
      val5: ['Val5 VAL1 / FOO'],
      val6: ['VAL6 Val2 / bar'],
    });
  });
});
