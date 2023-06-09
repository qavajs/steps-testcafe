import { getValue, getValueWait, getConditionWait, getElement } from '../utils.js'
import { test, expect } from 'vitest';
test.each([
    getValue,
    getValueWait,
    getConditionWait,
    getElement
])('util function %p', (fn) => {
    expect(fn).toBeInstanceOf(Function);
});
