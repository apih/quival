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
});
