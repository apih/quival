import { strict as assert } from 'assert';
import {
  escapeRegExp,
  flattenObject,
  getByPath,
  isDigits,
  isEmpty,
  isNumeric,
  isPlainObject,
  isValidDate,
  parseCsvString,
  parseDate,
  parseDateByFormat,
  setByPath,
  toCamelCase,
  toSnakeCase,
} from '../src/helpers.js';

describe('Helpers', () => {
  it('toCamelCase', () => {
    assert.equal(toCamelCase('a_test_name'), 'aTestName');
    assert.equal(toCamelCase('_test_name'), 'testName');
    assert.equal(toCamelCase('a-test-name'), 'aTestName');
    assert.equal(toCamelCase('-test-name'), 'testName');
    assert.equal(toCamelCase('a test name'), 'aTestName');
    assert.equal(toCamelCase(' test name'), 'testName');
  });

  it('toSnakeCase', () => {
    assert.equal(toSnakeCase('aTestName'), 'a_test_name');
    assert.equal(toSnakeCase('a_testName'), 'a_test_name');
    assert.equal(toSnakeCase('ATESTNAME'), 'a_t_e_s_t_n_a_m_e');
  });

  it('escapeRegExp', () => {
    assert.equal(escapeRegExp('.*+?^${}()|[]\\'), '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('getByPath', () => {
    assert.equal(getByPath({ a: { b: 1 } }, 'a.b'), 1);
    assert.equal(getByPath({ a: [1, { c: 2 }] }, 'a.1.c'), 2);
  });

  it('setByPath', () => {
    let obj = { a: { b: 1 } };
    setByPath(obj, 'a.b', 3);

    assert.deepEqual(obj, { a: { b: 3 } });

    obj = { a: [1, { c: 2 }] };
    setByPath(obj, 'a.1.c', 5);

    assert.deepEqual(obj, { a: [1, { c: 5 }] });
  });

  it('flattenObject', () => {
    assert.deepEqual(flattenObject({ a: 1, b: { x: 41, y: 42 } }), { a: 1, 'b.x': 41, 'b.y': 42 });
    assert.deepEqual(flattenObject({ a: 1, b: [71, 73, 75] }), { a: 1, 'b.0': 71, 'b.1': 73, 'b.2': 75 });
  });

  it('parseCsvString', () => {
    assert.deepEqual(parseCsvString('a,b,c'), ['a', 'b', 'c']);
    assert.deepEqual(parseCsvString('a, b, c'), ['a', ' b', ' c']);
    assert.deepEqual(parseCsvString('"a","b","c"'), ['a', 'b', 'c']);
    assert.deepEqual(parseCsvString('"a", "b", "c"'), ['a', 'b', 'c']);
    assert.deepEqual(parseCsvString('"a", "b", ""'), ['a', 'b', '']);

    assert.deepEqual(parseCsvString('"r2""c1","r2c2","r2c3"'), ['r2"c1', 'r2c2', 'r2c3']);
    assert.deepEqual(parseCsvString('"r2""c1",r2c2,r2c3'), ['r2"c1', 'r2c2', 'r2c3']);
    assert.deepEqual(parseCsvString('r1c1,"r1,c2",r1c3'), ['r1c1', 'r1,c2', 'r1c3']);
    assert.deepEqual(parseCsvString('"r2""c1",r2c2,"r2""""c3"'), ['r2"c1', 'r2c2', 'r2""c3']);
    assert.deepEqual(parseCsvString('r1c1,"r1,c2","r1"",""c3"'), ['r1c1', 'r1,c2', 'r1","c3']);
  });

  it('parseDate', () => {
    const date1 = new Date('2023/08/11 00:00:00');
    const date2 = new Date('2023/08/11 08:40:50 am');
    const date3 = new Date();
    date3.setHours(8);
    date3.setMinutes(40);
    date3.setSeconds(50);
    date3.setMilliseconds(0);

    assert.deepEqual(parseDate('11-08-2023'), date1);
    assert.deepEqual(parseDate('11-08-2023 08:40:50'), date2);
    assert.deepEqual(parseDate('11-08-2023 08:40:50 am'), date2);
    assert.deepEqual(parseDate('11/08/2023'), date1);
    assert.deepEqual(parseDate('11/08/2023 08:40:50'), date2);
    assert.deepEqual(parseDate('11/08/2023 08:40:50 am'), date2);
    assert.deepEqual(parseDate('11.08.2023'), date1);
    assert.deepEqual(parseDate('11.08.2023 08:40:50'), date2);
    assert.deepEqual(parseDate('11.08.2023 08:40:50 am'), date2);

    assert.deepEqual(parseDate('2023-08-11'), date1);
    assert.deepEqual(parseDate('2023-08-11 08:40:50'), date2);
    assert.deepEqual(parseDate('2023-08-11 08:40:50 am'), date2);
    assert.deepEqual(parseDate('2023/08/11'), date1);
    assert.deepEqual(parseDate('2023/08/11 08:40:50'), date2);
    assert.deepEqual(parseDate('2023/08/11 08:40:50 am'), date2);
    assert.deepEqual(parseDate('2023.08.11'), date1);
    assert.deepEqual(parseDate('2023.08.11 08:40:50'), date2);
    assert.deepEqual(parseDate('2023.08.11 08:40:50 am'), date2);

    assert.deepEqual(parseDate('08:40:50 2023-08-11'), date2);
    assert.deepEqual(parseDate('08:40:50 am 2023-08-11'), date2);
    assert.deepEqual(parseDate('08:40:50 2023/08/11'), date2);
    assert.deepEqual(parseDate('08:40:50 am 2023/08/11'), date2);
    assert.deepEqual(parseDate('08:40:50 2023.08.11'), date2);
    assert.deepEqual(parseDate('08:40:50 am 2023.08.11'), date2);

    assert.deepEqual(parseDate('08:40:50'), date3);
    assert.deepEqual(parseDate('08:40:50 am'), date3);
    assert.deepEqual(parseDate('08:40:50'), date3);
    assert.deepEqual(parseDate('08:40:50 am'), date3);
    assert.deepEqual(parseDate('08:40:50'), date3);
    assert.deepEqual(parseDate('08:40:50 am'), date3);
  });

  it('parseDateByFormat', () => {
    const date1 = new Date('2023/08/11 00:00:00');
    const date2 = new Date('2023/08/11 08:40:50 am');
    const date3 = new Date();
    date3.setHours(8);
    date3.setMinutes(40);
    date3.setSeconds(50);
    date3.setMilliseconds(0);

    assert.deepEqual(parseDateByFormat('08-11-2023', 'm-d-Y'), date1);
    assert.deepEqual(parseDateByFormat('08-11-23', 'm-d-y'), date1);
    assert.deepEqual(parseDateByFormat('08-11-2023 08:40:50', 'm-d-Y H:i:s'), date2);
    assert.deepEqual(parseDateByFormat('08-11-23 08:40:50', 'm-d-y H:i:s'), date2);
    assert.deepEqual(parseDateByFormat('08-11-2023 08:40:50 am', 'm-d-Y H:i:s a'), date2);
    assert.deepEqual(parseDateByFormat('08-11-23 08:40:50 am', 'm-d-y H:i:s a'), date2);
  });

  it('isDigits', () => {
    assert(isDigits(123));
    assert(isDigits('123'));
    assert(!isDigits('abc'));
    assert(!isDigits('abc123'));
  });

  it('isEmpty', () => {
    assert(isEmpty(''));
    assert(isEmpty(null));
    assert(isEmpty(undefined));
    assert(!isEmpty(123));
    assert(!isEmpty('abc'));
    assert(!isEmpty({}));
    assert(!isEmpty([]));
  });

  it('isNumeric', () => {
    assert(isNumeric(123));
    assert(isNumeric('123'));
    assert(!isNumeric('abc'));
    assert(!isNumeric(true));
  });

  it('isPlainObject', () => {
    assert(isPlainObject({}));
    assert(!isPlainObject([]));
    assert(!isPlainObject(new Date()));
  });

  it('isValidDate', () => {
    assert(isValidDate(new Date()));
    assert(isValidDate(new Date('2023/08/11 00:00:00')));
    assert(isValidDate(new Date('2023/08/11 08:40:50 am')));
    assert(isValidDate(new Date('08:40:50 am 2023/08/11')));
    assert(!isValidDate(new Date('')));
    assert(!isValidDate(new Date('08:40:50 am')));
  });
});
