import { Then } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import { expect } from 'chai';
import * as testcafe from 'testcafe';

declare global {
    var t: TestController;
    var testcafe: TestCafe;
    var runner: Runner;
    var taskPromise: any;
    var config: any;
}


Then('I expect {string} memory value to be equal {string}', async function(actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(expectedValue).to.eql(actualValue);
});
