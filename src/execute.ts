import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import memory from '@qavajs/memory';
import { ClientFunction } from 'testcafe';

const resolveFunction = (fnDef: string | Function) => typeof fnDef === 'string' ? eval(`() => ${fnDef}`) : fnDef;
/**
 * Execute client function
 * @param {string} functionKey - memory key of function
 * @example I execute '$fn' function // fn is function reference
 * @example I execute 'window.scrollBy(0, 100)' function
 */
When('I execute {string} function', async function (functionKey) {
    const fnDef = await getValue(functionKey);
    const clientFunction = ClientFunction(resolveFunction(fnDef));
    await clientFunction.with({ boundTestRun: t })();
});

/**
 * Execute client function and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute 'window.scrollY' function and save result as 'scroll'
 */
When('I execute {string} function and save result as {string}', async function (functionKey, memoryKey) {
    const fnDef = await getValue(functionKey);
    const clientFunction = ClientFunction(resolveFunction(fnDef));
    memory.setValue(memoryKey, await clientFunction.with({ boundTestRun: t })());
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' // fn is function reference
 * @example I execute 'target.scrollIntoView()' function on 'Component > Element'
 */
When('I execute {string} function on {string}', async function (functionKey, alias) {
    const fnDef = await getValue(functionKey);
    const element = await getElement(alias);
    const clientFunction = ClientFunction(resolveFunction(fnDef), {
        dependencies: { target: element }
    });
    await clientFunction.with({ boundTestRun: t })();
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' and save result as 'innerText' // fn is function reference
 * @example I execute 'target.innerText' function on 'Component > Element' and save result as 'innerText'
 */
When(
    'I execute {string} function on {string} and save result as {string}',
    async function (functionKey, alias, memoryKey) {
        const fnDef = await getValue(functionKey);
        const element = await getElement(alias);
        const clientFunction = ClientFunction(resolveFunction(fnDef), {
            dependencies: { target: element }
        });
        memory.setValue(memoryKey, await clientFunction.with({ boundTestRun: t })());
    }
);
